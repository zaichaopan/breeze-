require('dotenv').config('../.env');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const promisify = require('es6-promisify');
const userFactory = require('../db/factories/user');
const User = require('../models/user')

before((done) => {
    mongoose.connect(process.env.TEST_DATABASE, {
        useMongoClient: true
    });

    mongoose.connection
        .once('open', () => {
            console.log('Good to go!')
            done();
        })
        .on('error', error => console.warn('warning', error));



});

beforeEach((done) => {
    removeData(done);
});

async function removeData(done) {
    for (var collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].remove();
    }

    user = userFactory.make({
        email: 'john@example.com'
    });
    const register = promisify(User.register, User);

    register(user, 'password').then(() => {
        done();
    });

}
