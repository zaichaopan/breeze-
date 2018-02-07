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
        unique:true,
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    confirmed: { type: Boolean, default: false },
    confirmationToken: String,
    confirmationExpires: Date,
    avatar: {
        type: String
    }
});
