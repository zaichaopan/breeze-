const faker = require('faker');
const Thread = require('../../models/thread');
const userFactory = require('./user');

exports.create = async(override = null) => {
    let thread = new Thread({
        ...{
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph()
        },
        ...override
    });

    let {
        _id
    } = override;

    if (_id) {
        let user = await userFactory.create();
        _id = user._id;
    }

    await thread.save({
        _id
    });
    return thread;
};
