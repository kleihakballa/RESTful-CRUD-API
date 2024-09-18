const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    publicationDate:{
        type: Date,
        required: false,
    },
    genre:{
        type: String,
        required: true,
        trim:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authors",
        required: true
    },
    availableCopies:{
        type: Number,
        required: true,
        min: 0
    },
    bookType:{
        type: String,
        enum:['standard','premium'],
        default: 'standard'
    },
    availabilityAlerts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
    }],
    comments: [
        {
            text: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{timestamps: true });

const Books = mongoose.model("Books",bookSchema);

module.exports = Books;
