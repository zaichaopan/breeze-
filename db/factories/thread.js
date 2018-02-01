const faker = require('faker');
const Thread = require('../../models/thread');
const userFactory = require('./user');

exports.create = async (override = {}) => {
    let thread = new Thread({
        ...{
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph()
        },
        ...override
    });

    let {
        author
    } = override;

    if (!author) {
        author = await userFactory.create();

        thread.author = author._id;
    }

    await thread.save(author);
    return thread;
};
