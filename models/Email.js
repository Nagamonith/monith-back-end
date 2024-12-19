const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    sem: {
        type: Number,
    },
    emails: {
        type: [String],
    }
});

module.exports = new mongoose.model('Email', EmailSchema);