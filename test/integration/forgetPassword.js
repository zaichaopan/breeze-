const { expect } = require('chai');
const app = require('../../app');
const request = require('supertest');
const { clearDb } = require('../helper');
const userFactory = require('../../db/factories/user');
const User = require('../../models/user');
const mail = require('../../helper/mail');

describe.only('forget password', function() {
    this.timeout(5000);
    beforeEach(async function() {
        await clearDb();
    });

    describe('GET /forget-password', function() {
        it('should get 200', function(done) {
            request(app)
                .get('/forget-password')
                .expect(200, done);
        });
    });

    describe('POST /forget-password', function() {
        describe('When email not exist', function() {
            it('should redirect back', function(done) {
                request(app)
                    .post('/forget-password')
                    .send({
                        email: 'john@example.com'
                    })
                    .expect(302, done);
            });
        });

        describe('When email exists', function() {
            it('should send user reset password link', async function() {
                mail.fake();

                let user = await userFactory.create();

                expect(user.password_reset_token).equal(undefined);
                expect(user.password_reset_token).to.equal(undefined);

                let res = await request(app)
                    .post('/forget-password')
                    .send({ email: user.email });

                expect(res.status).to.equal(302);

                let updatedUser = await User.findOne({ _id: user._id });

                expect(updatedUser.password_reset_token).to.not.equal(
                    undefined
                );
                expect(updatedUser.password_reset_expire_at).to.not.equal(
                    undefined
                );
                expect(mail.hasSentTo(user.email)).to.be.true;
            });
        });
    });
});
