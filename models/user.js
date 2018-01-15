const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = require('../db/schemas/user');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const User = mongoose.model('user', userSchema);

module.exports = User;
