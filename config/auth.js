const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const loginController = require('../auth/login');

module.exports = (parent, options) => {
    const {verbose} = options;
    const app = express();
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(passport.initialize());
    app.use(passport.session());

    // authentication router
    // app.get('/login', loginController.showLoginForm);
    // app.post('/login', loginController.login);

    verbose && console.log('auth registered successfully');

    parent.use(app);
}


