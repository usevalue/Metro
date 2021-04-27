const mongoose = require('mongoose');
const {resourceSchema} = require('./economymodels.js');
const {resourceTypes} = require('../gameconstants.js');

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
        type: [resourceSchema],
        default: [{type: resourceTypes.STEEL, amount: 100},
            {type: resourceTypes.LUMBER, amount: 100},
            {type: resourceTypes.CONCRETE, amount: 100}]
    }
});


const City = mongoose.model('City', citySchema, 'cities');

module.exports = City