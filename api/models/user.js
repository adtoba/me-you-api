const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    about: {
        type: String, 
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    phone: {
        type: Number,
        default: ''
    }

});

module.exports = mongoose.model('User', userSchema);