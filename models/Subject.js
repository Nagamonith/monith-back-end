const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    branch: {
        type: String,
    },
    subject: {
        type: String,
    },
    sem: {
        type: Number,
    },
    subcode: {
        type: [String],
    }
});

module.exports = new mongoose.model('Subject', SubjectSchema);