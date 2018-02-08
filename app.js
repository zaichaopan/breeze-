require('dotenv').config();
const path = require('path');
const express = require('express');
const flash = require('connect-flash');
const bodyParse = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const isProd = process.env.NODE_ENV === 'production';
const promisify = require('es6-promisify');
const app = (module.exports = express());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(expressValidator());

app.use(cookieParser());

app.use(bodyParse.json());
app.use(
    bodyParse.urlencoded({
        extended: true
    })
);

app.use(methodOverride('_method'));

app.use(flash());

require('./config/db')(app, {
    verbose: !module.parent
});

require('./config/session')(app, {
    verbose: !module.parent
});

require('./config/auth')(app, {
    verbose: !module.parent
});

app.use((req, res, next) => {
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

// promisify
app.use((req, res, next) => {
    req.login = promisify(req.login, req);
    next();
});

// routing
require('./routes')(app);

app.use((err, req, res, next) => {
    if (!err.errors) return next(err);
    const errorKeys = Object.keys(err.errors);
    const errors = errorKeys.forEach(key =>
        req.flash('error', err.errors[key].message)
    );
    res.locals.flashes = req.flash();
    res.redirect('back');
});

app.use((err, req, res, next) => {
    if (!module.parent && !isProd) console.log(err.stack);
    res.status(500).render('errors/5xx');
});

app.use((req, res, next) => {
    if (res.statusCode === 403) {
        return res.render('errors/403', {
            url: req.originalUrl
        });
    }

    res.status(404).render('errors/404', {
        url: req.originalUrl
    });
});

if (!module.parent) {
    app.listen(3000, () => console.log('Express is running on:3000'));
}
