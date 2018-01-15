const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

module.exports = (parent, options) => {
    const { verbose } = options;
    const app = express();
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));

    parent.use(app);
    verbose && console.log('session registered successfully');
};
