const request = require('supertest');
const app = require('../app');
const asyncWrapper = require('../helper/asyncWrapper');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

exports.loginAs = async credential => {
    let res = request.agent(app);
    await res
        .post('/login')
        .send(credential)
        .expect(302);

    return res;
};

exports.clearDb = async () => {
    for (var collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].remove();
    }
};
