const mongoose = require('mongoose')

const membersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    age:{
      type: Number,
      required: true,
    },
    membershipNumber:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },

    dateOfMembership:{
        type: Date,
        default: Date.now,
        required: false,
    },
    membershipType:{
        type: String,
        enum:['standard','premium'],
        default: 'standard'
    },
    borrowingLimit:{
      type: Number,
      default: function (){
          return this.membershipType === 'premium' ? 10 : 5;
      },
    },

},{timestamps: true });

const Members = mongoose.model("Members",membersSchema);

module.exports = Members;
