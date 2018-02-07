const { expect } = require('chai');
const app = require('../../app');
const request = require('supertest');
const { clearDb } = require('../helper');
const userFactory = require('../../db/factories/user');
const User = require('../../models/user');

describe('email confirmation', function() {
    let user;

    beforeEach(async function() {
        await clearDb();

        user = await userFactory.create({ confirmation_token: 'valid-code' });
    });

    describe('GET /register/confirmation/:confirmation_token', function() {
        describe('When token not valid', function() {
            it('should get 404', async function() {
                let res = await request(app).get(
                    '/register/confirmation/invalid-code'
                );

                expect(res.status).to.equal(404);
            });
        });

        describe('When token', function() {
            it('should confirm user email and login user in', async function() {
                expect(user.isNew).to.be.false;
                expect(user.is_confirmed).to.be.false;

                let res = await request(app).get(
                    '/register/confirmation/valid-code'
                );

                expect(res.status).to.equal(302);
                expect(res.header.location).to.equal('/login');

                let userConfirmed = await User.findOne({
                    _id: user._id,
                    is_confirmed: true,
                    confirmation_token: null
                });

                expect(userConfirmed).is.not.be.null;
            });
        });
    });
});
