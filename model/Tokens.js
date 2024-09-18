const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    email: {
        type: String,
    },
    token:{
        type: String,
    }
})

const token = mongoose.model( "token" , tokenSchema);

module.exports = token;

