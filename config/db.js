const express = require('express');
const mongoose = require('mongoose');

module.exports = (parent, options) => {
    const { verbose } = options;
    const app = express();
    mongoose.connect(process.env.DATABASE, { useMongoClient: true });
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', err => console.error(`Mongo Connect Error: ${err.message}`));
    verbose && console.log('db registered successfully');
    parent.use(app);
}
