require('dotenv').config();
const path = require('path');
const express = require('express');
const flash = require('connect-flash');
const bodyParse = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const isProd = process.env.NODE_ENV === 'production';
const app = module.exports = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(cookieParser());

app.use(flash());

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));

require('./config/boot')(app, {
    verbose: !module.parent
});

app.use((err, req, res, next) => {
console.log('in here');
console.log(err);
    if (!module.parent && !isProd) console.log(err.stack);
    res.status(500).render('errors/5xx');
});

app.use((req, res, next) => {
    res.status(404).render('errors/404', {
        url: req.originalUrl
    });
});

if (!module.parent) {
    app.listen(3000, () => console.log('Express is running on:3000'));
}
