require('dotenv').config();
const express = require('express');
const isProd = process.env.NODE_ENV === 'production';
const app = module.exports = express();

require('./config/boot')(app, {verbose: !module.parent});

app.use((err, req, res, next) => {
    if (!module.parent && !isProd) console.log(err.stack);
    res.status(500).render('5xx');
});

app.use((req, res, next) => {
    res.status(404).render('404', {
        url: req.originalUrl
    });
});

if (!module.parent) {
    app.listen(3000, () => console.log('Express is running on:3000'));
}
