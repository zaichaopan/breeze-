const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: 'Please Supply an email address'
    },
    name: {
        type: String,
        required: 'Please Supply a name',
        trim: true
    },
});

module.exports = user;
