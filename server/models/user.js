const {ObjectID} = require('mongodb')
const mongoose = require('mongoose');

//  Authentication data

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: ObjectID,  // City's _id property
    }
}, {
    timestamps: {
        createdAt: "created_at"
    }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;