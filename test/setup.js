require('dotenv').config('../.env');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const promisify = require('es6-promisify');
const userFactory = require('../db/factories/user');
const User = require('../models/user')

before(async function() {
    mongoose.connect(process.env.TEST_DATABASE, { useMongoClient: true });

    await mongoose.connection
        .once('open', () => console.log('Good to go!'))
        .on('error', error => console.warn('warning', error));

    await clearDb();
});

async function clearDb() {
    for (var collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].remove();
    }
}
