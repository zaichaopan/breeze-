const faker = require('faker');
const User = require('../../models/user');

exports.make = (override = null) => {
    return new User({
        ...{
            name: faker.name.findName(),
            email: faker.internet.email()
        },
        ...override
    });
};
