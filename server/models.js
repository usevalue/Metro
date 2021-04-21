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
    concrete: {
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
    gold: {
        type: Number,
        default: 0
    },
    emeralds: {
        type: Number,
        default: 0
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
    mayor: {
        type: String
    },
    spatial: {
        type: [[districtSchema]],
        required: true,
    },
    cash: {
        type: Number,
        default: 100
    },
    reserves: {
        type: stockpile,
        default: {
            lumber: 100,
            steel: 50,
            concrete: 10
        }
    }
});


// Messaging

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    unread: {
        type: Boolean,
        default: true
    },
    saved: {
        to: {
            type: Boolean,
            default: true,
        },
        from: {
            type: Boolean,
            default: true
        }
    },
    trade: {
        cashoffer: {
            type: Number,
        },
        goodsoffer: {
            type: stockpile,
        },
        goodsrequest: {
            type: stockpile
        }
    }
}, {
    timestamps: {
        sent_at: "sent_at"
    }
})

const City = mongoose.model('City', citySchema, 'cities');

const User = mongoose.model('User', userSchema, 'users');

module.exports = {City, User}