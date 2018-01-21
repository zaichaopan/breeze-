const faker = require('faker');
const User = require('../../models/user');
const promisify = require('es6-promisify');


exports.create = async(override = {}) => {
    const register = promisify(User.register, User);

    let user = new User({
        ...{
            name: faker.name.findName(),
            email: faker.internet.email()
        },
        ...override
    });

    let {
        password = 'password'
    } = override;

    await register(user, password);
    return user;
};
