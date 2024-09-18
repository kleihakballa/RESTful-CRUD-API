const Loans = require('../model/Loans');
const Books = require('../model/Books');
const Members = require('../model/Members');
const Axios = require('axios');
const apiKey = process.env.API_KEY;
const StatusCodes = require('http-status-codes') ;


//Get all loans
exports.getAllLoans = async (req, res) => {
    try{
        const loans = await Loans.find();
        res.status(StatusCodes.OK).json(loans);
    }catch(error){
        console.error('Error getting loans',error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
//Get loan by id
exports.getLoanById = async (req, res) => {
    try{
        const loanId = req.params.id;
        const loan = await Loans.findById(loanId)

        if(!loan){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Loan not found' });
        }
        res.status(StatusCodes.OK).json(loan);
    }catch (error){
        console.error('Error getting loan',error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

//Add a new loan
exports.createLoan = async (req, res) => {
    try {
        const memberId = req.body.memberId;
        const bookId = req.body.bookId;

        const member = await Members.findById(memberId);
        const book = await Books.findById(bookId);

        if (!member) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Member not found' });
        }
        if (!book) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
        }
        //borrowing limit check
        const activeLoansCount = await Loans.count({member:memberId , returnDate:{$exists:false}});
        if (activeLoansCount === member.borrowingLimit){
            return res.status(StatusCodes.NOT_FOUND).json({message: 'Borrowing limit reached. Please return a book before borrowing a new one.'});
        }

        // Age restriction check
        const ageRestrictions = {
            "erotic": 18,
            "horror": 16,
            "mature": 17,
        };

        const requiredAge = ageRestrictions[book.genre.toLowerCase()];
        if (requiredAge && member.age < requiredAge) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: `You must be at least ${requiredAge} years old to borrow this book` });
        }

        // Premium membership check for rare books
        if (book.bookType !== member.membershipType) {
            return res.status(StatusCodes.PAYMENT_REQUIRED).json({ message: 'Only premium members can borrow rare books' });
        }
        //Available copies check
        if (book.availableCopies === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Book not available' });
        }



        const loan = new Loans({
            book: bookId,
            member: memberId,
            loanDate: req.body.loanDate,
            dueDate: req.body.dueDate,
            returnDate: req.body.returnDate,
            status: req.body.status,
            fine: req.body.fine
        });

        await loan.save();

        book.availableCopies--;
        await book.save();
        res.status(StatusCodes.CREATED).json({ message: 'Loan created', loan });

    } catch (error) {
        console.error('Error creating loan', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

//Update Loans
exports.updateLoan = async (req, res) => {
    const updatedData = req.body;
    try{
        const updatedLoans = await Loans.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true, runValidators: true}
        );
        if(!updatedLoans) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Loan not found' });
        }
        res.status(StatusCodes.OK).json(updatedLoans);
    }catch(error){
        console.log("Error updating loans", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Server error"});
    }
}
//Delete a loan
exports.deleteLoan = async (req, res) => {
    try{
        const deleteLoan = await Loans.findByIdAndDelete(req.params.id);
        if(!deleteLoan) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Loan not found' });
        }
        res.status(StatusCodes.OK).json({
            code:200,
            message: 'Loan deleted successfully',
            deleteLoan
        });
    }catch(error){
        console.error("Error deleting loans", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Server error"});
    }
}

//Fine members with overdue
exports.addFinesForOverdueDates = async (req, res) => {
    try{
        const FINE_PER_DAY = 5;
        const currentDate = new Date();

        const overDueLoans = await Loans.find({
            returnDate:null,
            dueDate: { $lt: currentDate },
            status: 'borrowed'
        });
        if(overDueLoans.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Loan not found' });
        }
        for(const loan of overDueLoans){
            const overDueDays = Math.floor((currentDate - loan.dueDate) / (1000 * 60 * 60 * 24));
            const fineAmount = overDueDays * FINE_PER_DAY;
            await Loans.findByIdAndUpdate(loan._id,{fine: fineAmount, status: 'overdue'});

        }
        res.status(StatusCodes.OK).json({message:'Fines added to overdue Loans'});
    }catch (error) {
        console.error("Error adding loans", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Server error"});
    }
};
//Notify members
exports.notifyMembers = async (book) => {
    try {
        const membersToNotify = book.availabilityAlerts; // Members who requested to be notified

        for (const memberId of membersToNotify) {
            const member = await Members.findById(memberId); // Fetch member details

            if (member) {
                // Sending an email notification
                const response = await Axios.post('https://api.sendgrid.com/v3/mail/send', {
                        personalizations: [{
                            to: [{ email: to }],
                            subject: subject
                        }],
                        from: { email: 'klei.hakballa@gmail.com' }, // Replace with your verified sender email
                        content: [{
                            type: 'text/plain',
                            value: text
                        }]
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        }
                });

                console.log(`Notification sent to member ${member.name} (${member.email}) for book "${book.title}".`);
            }
        }


        book.availabilityAlerts = [];
        await book.save();

    } catch (error) {
        console.error('Error notifying members', error);
    }
};

//Return Book
exports.returnBook = async (req, res) => {
    try{
        const loanId = req.params.id;

        const loan = await Loans.findById(loanId);
        if(!loan){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Loan not found' });
        }
        const book = await Books.findById(loan.book);
        if(!book){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
        }
        loan.returnDate = new Date();
        loan.status = 'returned';
        await loan.save();

        book.availableCopies++;
        await book.save();

        //Notify members
        if (book.availableCopies > 0 && book.availabilityAlerts.length > 0) {
            await notifyMembers(book);
        }


        res.status(StatusCodes.OK).json({message:'Book returned', loan});
    }catch(error){
        console.error("Error updating loans", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Server error"});
    }
};







