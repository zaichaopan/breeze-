require('dotenv').config('../.env');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
    done();
}
