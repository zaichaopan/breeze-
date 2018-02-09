const faker = require('faker');
const Channel = require('../../models/channel');

exports.create = async (override = {}) => {
    let channel = new Channel({
        ...{
            name: faker.lorem.word(),
            description: faker.lorem.sentence()
        },
        ...override
    });
    
    await channel.save();

    return channel;
};
