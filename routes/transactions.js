const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

//Post transaction
router.post('/', transactionController.createTransaction);

//Get transaction
router.get('./', transactionController.getTransactions);

//Pay transactions
router.post('/', transactionController.payTransactions);

module.exports = router;
