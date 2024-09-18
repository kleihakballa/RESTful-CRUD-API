const mongoose = require('mongoose');

const loansSchema = new mongoose.Schema({
    book:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }],
    member:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    loanDate:{
        type: Date,
        default: Date.now,
        required: false,
    },
    dueDate:{
        type: Date,
        required: true,
    },
    returnDate:{
        type: Date,
        required: false,
    },
    status:{
        type: String,
        enum:['active', 'borrowed','returned', 'overdue'],
        default: 'active',
    },
    fine:{
        type: Number,
        required: false,
        default: 0,
        min: 0,
    }

},{timestamps:true});

const Loans = mongoose.model('Loans',loansSchema);

module.exports = Loans;
