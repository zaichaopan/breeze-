const express = require('express');
const passport = require('passport');
const User = require('../models/user');

module.exports = (parent, options) => {
    const {verbose} = options;
    const app = express();
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(passport.initialize());
    app.use(passport.session());
    
    verbose && console.log('auth registered successfully');

    parent.use(app);
}


