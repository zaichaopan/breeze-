const app = require('../../app');
const request = require('supertest');
const Thread = require('../../models/thread');
const Reply = require('../../models/reply');
const threadFactory = require('../../db/factories/thread');
const userFactory = require('../../db/factories/user');
const {expect} = require('chai');
const {loginAs, clearDb} = require('../helper');

describe('replies', function() {
    this.timeout(5000);

    let john;
    let jane;
    let thread;
    let replyByJohn;
    let loginAsJohn;

    before(async function() {
        await clearDb();

        john = await userFactory.create({
            email: 'john@example.com',
            password: 'password'
        });

        jane = await userFactory.create({
            email: 'jane@example.com',
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

    describe('STORE /threads/:threadId/replies', function() {
        describe('when not login', function() {
            it('Should redirect to login', function(done) {
                request(app)
                    .post(`/threads/${thread._id}/replies`)
                    .send({})
                    .expect('Location', '/login')
                    .expect(302, done);
            });
        });

        describe('when login', function() {
            describe('when reply body not exist', function() {
                it('it should get 302', function(done) {
                    loginAsJohn
                        .post(`/threads/${thread._id}/replies`)
                        .send({})
                        .expect(302, done);
                });
            });

            describe('when reply body exist', function() {
                it('it should create reply to a thread for user', async function() {
                    const res = await loginAsJohn
                        .post(`/threads/${thread._id}/replies`)
                        .send({
                            body: 'new reply'
                        });

                    let replies = await thread.replies();
                    let reply = replies.find(
                        reply => reply.body === 'new reply'
                    );
                    expect(reply.author.toString()).to.include(
                        john._id.toString()
                    );
                });
            });
        });
    });

    describe('PUT /threads/:threadId/replies/:replyId', function() {
        describe('when not login', function() {
            it('Should redirect to login', function(done) {
                request(app)
                    .post(
                        `/threads/${thread._id}/replies/${
                            replyByJohn._id
                        }?_method=PUT`
                    )
                    .expect('Location', '/login')
                    .expect(302, done);
            });
        });

        describe('when login', function() {
            describe('when reply not found', function() {
                it('should get 404', function(done) {
                    loginAsJohn
                        .post(`/threads/${thread._id}/replies/abc?_method=PUT`)
                        .expect(404, done);
                });
            });

            describe('when reply found', function() {
                describe('when not author', function() {
                    it('should get 403', async function() {
                        let replyByJane = await thread.addReply({
                            body: 'foobar',
                            author: jane._id
                        });

                        const res = await loginAsJohn
                            .post(
                                `/threads/${thread._id}/replies/${
                                    replyByJane._id
                                }?_method=PUT`
                            )
                            .send({});

                        expect(res.status).to.be.equal(403);
                    });
                });

                describe('when author', function() {
                    describe('when reply body not exist', function() {
                        it('it should get 302', function(done) {
                            loginAsJohn
                                .post(
                                    `/threads/${thread._id}/replies/${
                                        replyByJohn._id
                                    }?_method=PUT`
                                )
                                .send({})
                                .expect(302, done);
                        });
                    });

                    describe('when reply body exist', function() {
                        it('it should update reply to a thread for user', async function() {
                            expect(replyByJohn.body).to.be.equal('foobar');
                            const res = await loginAsJohn
                                .post(
                                    `/threads/${thread._id}/replies/${
                                        replyByJohn._id
                                    }?_method=PUT`
                                )
                                .send({
                                    body: 'update body'
                                });
                            let updatedReply = await Reply.findOne({
                                _id: replyByJohn._id
                            });
                            expect(updatedReply.body).to.be.equal(
                                'update body'
                            );
                        });
                    });
                });
            });
        });
    });

    describe('DELETE /threads/:threadId/replies/:replyId', function() {
        describe('when not login', function() {
            it('Should redirect to login', function(done) {
                request(app)
                    .post(
                        `/threads/${thread._id}/replies/${
                            replyByJohn._id
                        }?_method=DELETE`
                    )
                    .expect('Location', '/login')
                    .expect(302, done);
            });
        });

        describe('when login', function() {
            describe('when reply not found', function() {
                it('should get 404', function(done) {
                    loginAsJohn
                        .post(
                            `/threads/${thread._id}/replies/abc?_method=DELETE`
                        )
                        .expect(404, done);
                });
            });

            describe('when reply found', function() {
                describe('when not author', function() {
                    it('should get 403', async function() {
                        let replyByJane = await thread.addReply({
                            body: 'foobar',
                            author: jane._id
                        });

                        const res = await loginAsJohn
                            .post(
                                `/threads/${thread._id}/replies/${
                                    replyByJane._id
                                }?_method=DELETE`
                            )
                            .send({});

                        expect(res.status).to.be.equal(403);
                    });
                });

                describe('when author', function() {
                    it('it should delete the reply', async function() {
                        const res = await loginAsJohn
                            .post(
                                `/threads/${thread._id}/replies/${
                                    replyByJohn._id
                                }?_method=DELETE`
                            )
                            .send({});

                        let result = await Reply.findOne({
                            _id: replyByJohn._id
                        });

                        expect(result).to.be.null;
                    });
                });
            });
        });
    });
});
