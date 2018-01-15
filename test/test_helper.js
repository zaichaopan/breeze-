require('dotenv').config('../.env');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Thread = require('../app/models/thread');
const fs = require('fs');
const path = require('path');

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

beforeEach((done) => removeData(done));

removeData = async(done) => {
    const dir = path.join(__dirname, '..', 'models');
    fs.readdirSync(dir).forEach(name => {
        const model = path.join(dir, name);
        if (fs.statSync(model).isDirectory()) return;
        const obj = require(model);
        await obj.remove();
    });
    done();
}
