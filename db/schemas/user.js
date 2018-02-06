const { Schema } = require('mongoose');

module.exports = new Schema({
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
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    avatar: {
        type: String
    }
});
