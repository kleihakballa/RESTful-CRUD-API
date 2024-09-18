const mongoose = require("mongoose");

const authorSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    birthDate:{
        type: Date,
        required: false,
    },
    nationality:{
        type: String,
        required: false,
        trim:true
    },
    books:[{
        type: String,
        required: false,
    }]
}, { timestamps: true });
const Authors = mongoose.model("Authors", authorSchema);

module.exports = Authors
