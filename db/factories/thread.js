const faker = require('faker');
const Thread = require('../../models/thread');

exports.create = async(override = null) => {
    let thread = new Thread({
        ...{
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph()
        },
        ...override
    });

    await thread.save();
    return thread;
};
