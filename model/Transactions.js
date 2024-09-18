const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['fine', 'payment', 'refund'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    paymentDetails:{
        type: String,
        required: false,
    }
}, { timestamps: true });

const Transactions = mongoose.model('Transaction', transactionSchema);

module.exports = Transactions;
