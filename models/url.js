const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({
    full: { //full url
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false,
    }
})

// export schema out
module.exports = mongoose.model('ShortUrl', shortUrlSchema)  