const path = require('path');
const app = require('../../app');
const { expect } = require('chai');
const User = require('../../models/user');
const request = require('supertest');
const userFactory = require('../../db/factories/user');
const { loginAs, clearDb } = require('../helper');
const { clearDisk, fileExists } = require('../../helper/storage');

describe.only('user avatar', function() {
    this.timeout(5000);

    let john;
    let loginAsJohn;

    before(async function() {
        await clearDb();

        john = await userFactory.create({
            email: 'john@example.com',
            password: 'password'
        });

        loginAsJohn = await loginAs({
            email: john.email,
            password: 'password'
        });
    });

    describe.only('POST /users/avatars', function() {
        describe('when not login', function() {
            it('should redirect to login', function(done) {
                request(app)
                    .post('/users/avatars')
                    .expect(302, done);
            });
        });

        describe('when login', function() {
            describe('when avatar does not exist', function() {
                it('should get 302', function(done) {
                    loginAsJohn
                        .post('/users/avatars')
                        .attach('avatar', null)
                        .expect(302, done);
                });
            });

            describe('when avatar exists', function() {
                describe('when it is not image', function() {
                    it('should update user avatar', function(done) {
                        let file = path.join(
                            __dirname,
                            '..',
                            'fixtures/test.pdf'
                        );
                        loginAsJohn
                            .post('/users/avatars')
                            .attach('avatar', file)
                            .expect(500, done);
                    });
                });

                describe('when it is image', function() {
                    it('should update user avatar', async function() {
                        let avatarDir = path.join(
                            __dirname,
                            '../..',
                            'public/uploads/avatars'
                        );

                        clearDisk(avatarDir);

                        let file = path.join(
                            __dirname,
                            '..',
                            'fixtures/test.jpg'
                        );

                        await loginAsJohn
                            .post('/users/avatars')
                            .attach('avatar', file);

                        let user = await User.findOne({ _id: john._id });

                        expect(user.avatar).to.not.be.null;

                        let avatarPath = user.avatar;

                        avatarPath = path.join(
                            __dirname,
                            '../..',
                            'public/uploads/avatars',
                            avatarPath
                        );

                        expect(fileExists(avatarPath)).to.be.true;
                        clearDisk(avatarDir);
                    });
                });
            });
        });
    });
});
