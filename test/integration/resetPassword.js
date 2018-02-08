const { expect } = require('chai');
const request = require('supertest');
const User = require('../../models/user');
const userFactory = require('../../db/factories/user');
const { clearDb } = require('../helper');
const app = require('../../app');

describe('Reset password', function() {
    this.timeout(5000);

    let user;

    beforeEach(async function() {
        clearDb();
        user = await userFactory.create({
            password_reset_token: 'valid-token',
            password_reset_expire_at: `${Date.now() + 3600000}`
        });
    });

    describe('GET /reset-password/:password_reset_token', function() {
        describe('When password reset token invalid', function() {
            it('should get 404', function(done) {
                request(app)
                    .get('/reset-password/invalid-token')
                    .expect(404, done);
            });
        });

        describe('When password reset token expires', function() {
            it('should get 404', async function() {
                await user.update({
                    password_reset_expire_at: `${Date.now()}`
                });

                await request(app)
                    .get('/reset-password/valid-token')
                    .expect(404);
            });
        });

        describe('When password rest token invalid and before expiration', function() {
            it('should show reset password page', async function() {
                await request(app)
                    .get('/reset-password/valid-token')
                    .expect(200);
            });
        });
    });

    describe('POST /reset-password', function() {
        describe('When password invalid', function() {
            it('should get 422', async function() {
                await request(app)
                    .post('/reset-password')
                    .send({
                        password: 'abc'
                    })
                    .expect(422);
            });
        });

        describe('When password_confirmation not match', function() {
            it('should get 422', async function() {
                await request(app)
                    .post('/reset-password')
                    .send({
                        password: 'password',
                        password_confirmation: 'password1'
                    })
                    .expect(422);
            });
        });

        describe('When password reset token invalid', function() {
            it('show get 404', async function() {
                await request(app)
                    .post('/reset-password')
                    .send({
                        password: 'newPassword',
                        password_confirmation: 'newPassword',
                        password_reset_token: 'invalid-token'
                    })
                    .expect(404);
            });
        });

        describe('When password reset token expires', function() {
            it('show get 404', async function() {
                await user.update({
                    password_reset_expire_at: `${Date.now()}`
                });

                await request(app)
                    .post('/reset-password')
                    .send({
                        password: 'newPassword',
                        password_confirmation: 'newPassword',
                        password_reset_token: 'valid-token'
                    })
                    .expect(404);
            });
        });

        describe('When reset with valid token and data before expirations', function() {
            it('should rest user password and login user in', async function() {
                let res = await request(app)
                    .post('/reset-password')
                    .send({
                        password: 'newPassword',
                        password_confirmation: 'newPassword',
                        password_reset_token: 'valid-token'
                    });

                expect(res.header.location).to.equal('/home');
            });
        });
    });
});
