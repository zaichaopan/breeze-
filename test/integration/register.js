const express = require('express');
const request = require('supertest');
const { expect } = require('chai');
const userFactory = require('../../db/factories/user');
const User = require('../../models/user');
const app = require('../../app');
const { loginAs, clearDb } = require('../helper');
const mail = require('../../helper/mail');

describe('register', function() {
    this.timeout(5000);

    let john;
    let loginAsJohn;

    beforeEach(async function() {
        await clearDb();
        john = await userFactory.create({
            name: 'john',
            email: 'john@example.com',
            password: 'password',
            is_confirmed: true
        });

        loginAsJohn = await loginAs({
            email: john.email,
            password: 'password'
        });
    });

    describe('when already login', function() {
        it('should redirect back to /home', function(done) {
            loginAsJohn
                .post('/register')
                .send({})
                .expect('Location', '/home')
                .expect(302, done);
        });
    });

    describe('when not login', function() {
        describe('when name not valid', function() {
            it('should get 422', async function() {
                let res = await request(app)
                    .post('/register')
                    .send({})
                    .set('Accept', 'application/json');

                let error = res.body.errors.find(
                    error => error.param === 'name'
                );

                expect(error).to.not.be.null;
                expect(res.status).to.equal(422);
            });
        });

        describe('when email not valid', function() {
            it('should get 422', async function() {
                let res = await request(app)
                    .post('/register')
                    .send({ email: 'abc' })
                    .set('Accept', 'application/json');

                let error = res.body.errors.find(
                    error => error.param === 'email'
                );

                expect(error.msg).to.equal('That Email is not valid!');
                expect(res.status).to.equal(422);
            });
        });

        describe('when password not valid', function() {
            it('should get 422', async function() {
                let res = await request(app)
                    .post('/register')
                    .send({ password: 'abc' })
                    .set('Accept', 'application/json');

                let error = res.body.errors.find(
                    error => error.param === 'password'
                );

                expect(error.msg).to.equal(
                    'passwords must be at least 6 chars long!'
                );
                expect(res.status).to.equal(422);
            });
        });

        describe('when password confirmation not valid', function() {
            it('should get 422', async function() {
                let res = await request(app)
                    .post('/register')
                    .send({
                        password: 'password',
                        password_confirmation: 'password1'
                    })
                    .set('Accept', 'application/json');

                let error = res.body.errors.find(
                    error => error.param === 'password_confirmation'
                );

                expect(error.msg).to.equal('Your passwords do not match!');
                expect(res.status).to.equal(422);
            });
        });

        describe('when name token', function() {
            it('should get 422 with proper message', async function() {
                let res = await request(app)
                    .post('/register')
                    .send({
                        name: john.name,
                        email: 'john@example.com',
                        password: 'password',
                        password_confirmation: 'password'
                    })
                    .set('Accept', 'application/json');

                let error = res.body.errors.find(
                    error => error.param === 'name'
                );

                expect(error.msg).to.equal(
                    'A user with the given name is already registered!'
                );

                expect(res.status).to.equal(422);
            });
        });

        describe('when email token', function() {
            it('should get 422 with proper message', async function() {
                let res = await request(app)
                    .post('/register')
                    .send({
                        name: 'abc',
                        email: john.email,
                        password: 'password',
                        password_confirmation: 'password'
                    })
                    .set('Accept', 'application/json');

                let error = res.body.errors.find(
                    error => error.param === 'email'
                );

                expect(error.msg).to.equal(
                    'A user with the given email is already registered!'
                );
                expect(res.status).to.equal(422);
            });
        });

        describe('when register with valid data', function() {
            it('should register a new user with given data and send registration confirmation', async function() {
                mail.fake();
                let res = await request(app)
                    .post('/register')
                    .send({
                        name: 'jane',
                        email: 'jane@example.com',
                        password: 'password',
                        password_confirmation: 'password'
                    })
                    .set('Accept', 'application/json');

                let newUser = await User.findOne({
                    name: 'jane',
                    email: 'jane@example.com'
                });

                expect(newUser).to.be.not.null;
                expect(mail.hasSentTo('jane@example.com')).to.be.true;
            });
        });
    });
});
