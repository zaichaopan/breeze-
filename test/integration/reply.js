const app = require('../../app');
const request = require('supertest');
const Thread = require('../../models/thread');
const threadFactory = require('../../db/factories/thread');
const userFactory = require('../../db/factories/user');
const {
    expect
} = require('chai');
const {
    loginAs
} = require('../helper');

describe('replies', function () {
    let thread;
    let john
    let jane;
    let commentByJohn;
    let loginAsJohn;
    let loginAsJane;

    before(async function () {
        jane = await userFactory.create({
            email: 'jane@example.com',
            password: 'password'
        });

        john = await userFactory.create({
            email: 'john@example.com',
            password: 'password'
        });

        thread = await threadFactory.create();

        replyByJohn = await thread.addReply({
            body: 'foobar',
            author: john._id
        });

        loginAsJohn = await loginAs({
            email: john.email,
            password: 'password'
        });

    });

    describe('STORE /threads/:threadId/replies', function () {
        describe('when not login', function () {
            it('Should redirect to login', function (done) {

            });
        });

        describe('when login', function () {
            describe('when reply body not exist', function () {
                it('it should get 302', function (done) {

                });
            });

            describe('when reply body exist', function () {
                it('it should create reply to a thread for user', function (done) {

                });
            });
        });
    });

    describe('PUT /threads/:threadId/replies/:replyId', function () {
        describe('when not login', function () {
            it('Should redirect to login', function (done) {

            });
        });

        describe('when login', function () {
            describe('when reply not found', function () {
                it('should get 404', function (done) {

                });
            });

            describe('when reply found', function () {
                describe('when not author', function () {
                    it('should get 403', function (done) {

                    })
                });

                describe('when author', function () {
                    describe('when reply body not exist', function () {
                        it('it should get 302', function (done) {

                        });
                    });

                    describe('when reply body exist', function () {
                        it('it should create reply to a thread for user', function (done) {

                        });
                    });
                })
            });
        });
    });


    describe('DELETE /threads/:threadId/replies/:replyId', function () {
        describe('when not login', function () {
            it('Should redirect to login', function (done) {

            });
        });

        describe('when login', function () {
            describe('when reply not found', function () {
                it('should get 404', function (done) {

                });
            });

            describe('when reply found', function () {
                describe('when not author', function () {
                    it('should get 403', function (done) {

                    })
                });

                describe('when author', function () {
                    it('it should delete the reply', function (done) {

                    });
                })
            });
        });
    });
});
