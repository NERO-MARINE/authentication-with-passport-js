const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    googleId:{
        type: String
    },
    provider:{
        type: String,
        required: true,
    }
}, {timestamps:true});


const User = mongoose.model('user', userSchema);

module.exports = User;