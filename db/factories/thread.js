const faker = require('faker');
const Thread = require('../../models/thread');

exports.make = (override = null) => {
    return new Thread({
        ...{
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph()
        },
        ...override
    });
};
