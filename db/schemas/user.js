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
        unique: true,
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    is_confirmed: { type: Boolean, default: false },
    confirmation_token: String,
    confirmation_expire_at: Date,
    avatar: {
        type: String
    }
});
