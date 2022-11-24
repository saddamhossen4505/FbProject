const mongoose = require('mongoose');


// Create-User_Schema.
const userSchema = mongoose.Schema({

    name : {
        type : String,
        trim : true,
        required : true,
    },
    email : {
        type : String,
        trim : true,
        unique : true,
        required : true,
    },
    cell : {
        type : String,
        trim : true
    },
    location : {
        type : String,
        trim : true
    },
    gender : {
        type : String,
        enum : ["Male", "Female"]
    },
    skill : {
        type : String,
    },
    photo : {
        type : String,
        trim : true
    },
    gallery : {
        type : Array
    },
    follower : {
        type : [ mongoose.Schema.Types.ObjectId ],
        ref : "User"
    },
    following : {
        type : [ mongoose.Schema.Types.ObjectId ],
        ref : "User"
    },
    password : {
        type : String,
        trim : true,
        required : true,
    },
    isAdmin : {
        type : Boolean,
        default : true,
    },
    isVerify : {
        type : Boolean,
        default : false
    }

}, {
    timestamps : true,
});

// Exports and use UserSchema.
module.exports = mongoose.model('user', userSchema );