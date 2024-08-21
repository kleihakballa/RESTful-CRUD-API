let mongoose = require ('mongoose');


const Student = mongoose.model('Student',{
    name:{
        type:String,
        required: true
    },
   age:{
        type:String,
        required: true
    }
});

module.exports = {Student}