const mongoose = require('mongoose');

const farthestEast = 7;
const farthestSouth = 7;

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
        type: String,  // City's _id property
        unique: true
    }
}, {
    timestamps: {
        createdAt: "created_at"
    }
});


// Geography

const stockpile = new mongoose.Schema({
    cash: {
        type: Number,
        default: 0
    },
    lumber: {
        type: Number,
        default: 0
    },
    steel: { 
        type: Number,
        default: 0
    },
    concrete: {
        type: Number,
        default: 0
    },
    gold: {
        type: Number,
        default: 0
    },
    emeralds: {
        type: Number,
    },

});

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Undeveloped land"
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    density: {
        type: Number,
        default: 0
    },
    resources: {
        type: stockpile
    },
    use: {
        type: String,
        default: "vacant"
    }
});

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        default: 'Metroville'
    },
    spatial: {
        type: [[districtSchema]],
        required: true,
    },
    reserves: {
        type: stockpile,
        default: {
            cash: 10,
            lumber: 100,
            steel: 50,
            concrete: 10
        }
    }
});


const City = mongoose.model('City', citySchema, 'cities');

const User = mongoose.model('User', userSchema, 'users');

module.exports = {City, User}