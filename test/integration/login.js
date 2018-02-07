const { expect } = require('chai');
const userFactory = require('../../db/factories/user');
const { clearDb } = require('../helper');
const request = require('supertest');
const app = require('../../app');

describe('login', function() {
    beforeEach(async function() {
        await clearDb();
    });

    describe('when email confirmed', function() {
        it('it should login user in', async function() {
            let userUnconfirmed = await userFactory.create({
                password: 'password',
                is_confirmed: true
            });

            expect(userUnconfirmed.isNew).to.be.false;
            expect(userUnconfirmed.is_confirmed).to.be.true;

            let res;

            res = await request(app)
                .post('/login')
                .send({
                    email: userUnconfirmed.email,
                    password: 'password'
                });

            expect(res.header.location).to.be.equal('/home');
            expect(res.status).to.be.equal(302);
        });
    });

    describe('when email not confirmed', function() {
        it('should redirect back with proper message', async function() {
            let userUnconfirmed = await userFactory.create({
                password: 'password'
            });

            expect(userUnconfirmed.isNew).to.be.false;
            expect(userUnconfirmed.is_confirmed).to.be.false;

            let res;

            res = await request(app)
                .post('/login')
                .send({
                    email: userUnconfirmed.email,
                    password: 'password'
                });

            expect(res.header.location).to.be.equal('/login');
            expect(res.status).to.be.equal(302);
        });
    });
});
