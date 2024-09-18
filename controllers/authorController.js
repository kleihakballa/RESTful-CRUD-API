const Authors = require("../model/Authors");
const StatusCodes = require('http-status-codes') ;

//Get all authors
exports.getAllAuthors = async (req, res) => {
    try{
        const authors = await Authors.find();
        res.json(authors);
    } catch(error){
        console.error('Error getting authors', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
//Get author by id
exports.getAuthorById = async (req, res) => {
   try {
       const authorId = req.params.id;
       const author = await Authors.findById(authorId);

       if (!author) {
           return res.status(StatusCodes.NOT_FOUND).json({message: 'Author not found'});
       }
       res.status(StatusCodes.OK).json(author);
   }catch (error){
       console.error('Error getting author', error);
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
   }
}

//Create a new author
exports.createAuthors = async (req, res) => {
    const author = new Authors({
        name: req.body.name,
        birthDate: req.body.birthDate,
        nationality: req.body.nationality,
        books: req.body.books,
    });

    try{
        const newAuthor = await author.save();
        res.status(StatusCodes.CREATED).json(newAuthor);
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error" });
    }
}
//Update Authors
exports.updateAuthors = async (req, res) => {
    const authorId = req.params.id;
    const updatedData = req.body;

    try{
        const updatedAuthor = await Authors.findByIdAndUpdate(
            authorId,
            updatedData,
            {new: true, runValidators:true}
    );

    if(!updatedAuthor) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found' });
    }
    res.status(StatusCodes.OK).json(updatedAuthor);
    }catch(error){
        console.log("Error updating author", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

//Delete Authors
exports.deleteAuthor = async (req, res) => {
    try {
        const deletedAuthor = await Authors.findByIdAndDelete(req.params.id);

        if (!deletedAuthor) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found' });
        }

        res.status(StatusCodes.OK).json({
            code: 200,
            message: 'Author deleted successfully',
            deletedAuthor
        });
    } catch (error) {
        console.error("Error deleting author:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

