const Transaction = require('../model/Transactions');  // Assuming the model file is named Transaction.js
const Member = require('../model/Members');  // Assuming the model file is named Member.js
const StatusCodes = require('http-status-codes') ;

exports.getTransactions = async (req, res) => {
    try {
        const memberId = req.params.id;

        // Find all transactions for the member
        const transactions = await Transaction.find({ member: memberId });
        if (!transactions || transactions.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No transactions found for this member' });
        }
        res.status(StatusCodes.OK).json(transactions);
    } catch (error) {
        console.error('Error getting transactions', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

exports.createTransaction = async (req, res) => {
    const { memberId, amount, type } = req.body;
    try {
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Member not found' });
        }
        const transaction = new Transaction({
            member: memberId,
            amount,
            type
        });

        await transaction.save();
        res.status(StatusCodes.CREATED).json({ message: 'Transaction recorded', transaction });
    } catch (error) {
        console.error('Error creating transaction', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

exports.payTransactions = async (req, res) => {
    const { transactionId, paymentDetails } = req.body;
    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Transaction not found' });
        }
        if (transaction.paymentStatus === 'completed') {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Transaction already completed' });
        }
        transaction.paymentStatus = 'completed';
        transaction.paymentDetails = paymentDetails;
        await transaction.save();

        res.status(StatusCodes.OK).json({ message: 'Payment processed', transaction });
    } catch (error) {
        console.error('Error processing payment', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
