const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

//Get all loans
router.get('/', loanController.getAllLoans);

//Get loan by id
router.get('/:id', loanController.getLoanById);

//Add a new loan
router.post('/', loanController.createLoan);

//Add fines for overdue loans
router.post('/add-fines',loanController.addFinesForOverdueDates);

//Update loan
router.put('/:id', loanController.updateLoan);

//Delete loan
router.delete('/:id', loanController.deleteLoan);

//Return book
router.post('/:id', loanController.returnBook);



module.exports = router;
