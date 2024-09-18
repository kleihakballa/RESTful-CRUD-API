const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const {authenticationMiddleware} = require("../middleware/authenticationMiddleware")
const Book = require('../model/Books');

//Get all books
router.get('/', bookController.getAllBooks);

//Get book by id
router.get('/:id', bookController.getBookById);

//Post a new book
router.post('/add', authenticationMiddleware, bookController.createBooks);

//Update Books
router.put('/update/:id', authenticationMiddleware,bookController.updateBooks);

//Delete Books
router.delete('/delete/:id', authenticationMiddleware,bookController.deleteBooks);

//Get and save
/*router.get('/searchAndSave', async (req,res) =>{
    const query = req.body.q;
    try{
        const savedBooks =await bookController.searchBooks(query);
        res.status(200).json(savedBooks);
    }catch(error){
        res.status(500).json({error:'Failed to fetch and save books'})
    }
})*/

router.post("/:id/comments", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const newComment = { text: req.body.text };
        book.comments.push(newComment);
        await book.save();

        res.json(book);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Get comments for a book
router.get("/:id/comments", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("comments");
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book.comments);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

router.delete("/:id/comments/:commentId", authenticationMiddleware,async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const commentIndex = book.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        book.comments.splice(commentIndex, 1);
        await book.save();

        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});
module.exports = router;
