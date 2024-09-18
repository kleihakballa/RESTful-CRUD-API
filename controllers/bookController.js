const Books = require('../model/Books');
const Members = require('../model/Members');
const axios = require('axios');
const StatusCodes = require('http-status-codes') ;
const Authors = require('../model/Authors');

//Get all books
exports.getAllBooks = async (req, res) => {
    try{
        const books = await Books.find().populate('author');
        res.json(books);
    } catch(error){
        console.error('Error getting books', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
//Get and save books from google
/*exports.searchBooks = async (query) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const booksData = response.data.items;

        const savedBooks = [];

        for (const item of booksData) {
            const bookInfo = item.volumeInfo;

            const newBook = new Book({
                title: bookInfo.title || 'Unknown Title',
                publicationDate: bookInfo.publishedDate ? new Date(bookInfo.publishedDate) : null,
                genre: bookInfo.categories ? bookInfo.categories[0] : 'Unknown Genre',
                author: bookInfo.authors ? bookInfo.authors[0] : 'Unknown Author',
                availableCopies: 1, // Default to 1 copy; adjust based on your needs
                bookType: 'standard' // Or set this based on other logic
            });

            const savedBook = await newBook.save();
            savedBooks.push(savedBook);
        }

        return savedBooks; // Return the saved books
    } catch (error) {
        console.error('Error fetching and saving data from Google Books API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch and save books');
    }
};*/
//Get book by id
exports.getBookById = async (req, res) => {
    try{
        const bookId = req.params.id;
        const book = await Books.findById(bookId).populate('author');

        if(!book){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
        }
        res.status(StatusCodes.OK).json(book);
    }catch (error){
        console.error('Error getting book', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}

//Create new books
exports.createBooks = async (req, res) => {
    try {
        const { title, publicationDate, genre, authorName, availableCopies, bookType } = req.body;

        if (!authorName) {
            return res.status(400).json({ error: 'Author name is required' });
        }

        const author = await Authors.findOne({ name: authorName });

        if (!author) {
            return res.status(404).json({ error: `Author with name ${authorName} not found.` });
        }


        const newBook = new Books({
            title,
            publicationDate,
            genre,
            author: author._id,
            availableCopies,
            bookType
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Server error.' });
    }
};
//Update books
exports.updateBooks = async (req, res) => {
    const booksId = req.params.id;
    const {authorName ,...updatedData} = req.body;

    try{
        if(authorName){
            const author = await Authors.findOne({name: authorName});
            if(!author){
                return res.status(404).json({ error: 'Author not found' });
            }
            updatedData.author = author._id;
        }
        const updatedBook = await Books.findByIdAndUpdate(
            booksId,
            updatedData,
            {new: true, runValidators:true}
        );

        if(!updatedBook) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
        }
        res.status(StatusCodes.OK).json(updatedBook);
    }catch(error){
        console.log("Error updating book", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
//Delete books
exports.deleteBooks = async (req, res) => {
    try {
        const deletedBooks = await Books.findByIdAndDelete(req.params.id);

        if (!deletedBooks) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(StatusCodes.OK).json({
            code: 200,
            message: 'Book deleted successfully',
            deletedBooks
        });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
//Request Availability
exports.requestAvailabilityAlert = async (req, res) => {
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

        if (book.availableCopies > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Book is currently available. No need to request an alert.' });
        }

        if (book.availabilityAlerts.includes(memberId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You are already subscribed to availability alerts for this book.' });
        }

        book.availabilityAlerts.push(memberId);
        await book.save();

        res.status(StatusCodes.CREATED).json({ message: 'Availability alert request added successfully' });
    } catch (error) {
        console.error('Error requesting availability alert', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};


