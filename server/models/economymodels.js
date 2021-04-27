const { ObjectId } = require('mongodb')
const mongoose = require('mongoose');
const {resourceTypes} = require('../gameconstants.js');
// Economy



const resourceSchema = new mongoose.Schema({
    type: {
        type: resourceTypes,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
});

//  Trade

const tradeSchema = {
    offer: {
        cash: {
            type: Number
        },
        goods: {
            type: [resourceSchema]
        }
    },
    demand: {
        cash: {
            type: Number
        },
        goods: {
            type: [resourceSchema]
        }
    }
}
//  Messaging

const messageSchema = new mongoose.Schema({
    // Subject line
    title: {
        type: String,
        required: true
    },
    //  Text body of the message
    message: {
        type: String,
        required: true
    },
    address: {
        type: String, // Who it's addressed to (for readers)
    },
    signature: {
        type: String,  // Who it's from (for readers)
    },
    //  ObjectIds for filing in inboxes/sent boxes
    to: {
        type: ObjectId,  //  ID of the receiving city
        required: true
    },
    from: {
        type: ObjectId,  // ID of the sending city
        required: true
    },
    //  Every message is initially unread, which will affect how it looks in recipient's inbox.
    unread: {
        type: Boolean,
        default: true
    },
    //  Messages are saved in inbox and outbox until deleted.  Once both delete, drop this one from database.
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
    //  A message may carry an offer of trade, handled on its own schema.
    trade: {
        type: tradeSchema
    }
}, {
    timestamps: {
        sent_at: "sent_at"
    }
})

const Message = mongoose.model('Message', messageSchema,'messages')

module.exports = {resourceSchema, Message}