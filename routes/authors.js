const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const {authenticationMiddleware} = require('../middleware/authenticationMiddleware');

//Get all authors
router.get('/', authorController.getAllAuthors);

//Get author by id
router.get('/:id',authorController.getAuthorById);

//Post a new author
router.post('/add', authenticationMiddleware, authorController.createAuthors);

//Update Author
router.put('/update/:id', authenticationMiddleware, authorController.updateAuthors);

//Delete Author
router.delete('/delete/:id',authenticationMiddleware, authorController.deleteAuthor);

module.exports = router;
