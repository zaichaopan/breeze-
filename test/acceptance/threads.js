const app = require('../../app');
const expect = require('expect');
const request = require('supertest');
const Thread = require('../../models/thread');
const threadFactory = require('../../db/factories/thread');
const userFactory = require('../../db/factories/user');

const {
    loginAs
} = require('../helper');


describe('threads', function () {
    let threadByJane;
    let jane;
    let loginAsJane;

    before(async function () {
        jane = await userFactory.create({
            email: 'jane@example.com',
            password: 'password'
        });
        threadByJane = await threadFactory.create({
            title: 'foobar',
            author: jane._id
        });
        loginAsJane = await loginAs({
            email: jane.email,
            password: 'password'
        });
    });


    describe('GET /threads', function () {
        it('should display a list of threads', function (done) {
            request(app).get('/threads')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.threads.map(item => item._id.toString())).toContain(threadByJane._id.toString());
                    done();
                });
        });
    });

    describe('GET /threads/:id', function () {
        describe('when present', function () {
            it('should display the thread', function (done) {
                request(app)
                    .get(`/threads/${threadByJane._id}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) return done();
                        expect(res.body.thread._id.toString()).toEqual(threadByJane._id.toString());
                        done();
                    });
            });
        });

        describe('when not present', function () {
            it('should 404', function (done) {
                request(app)
                    .get('/threads/abcd')
                    .expect(404, done)
            });
        })
    });

    describe('GET /threads/create', function () {
        describe('when login', function () {
            it('should display the create form', function (done) {
                loginAsJane
                    .get('/threads/create')
                    .expect(200, done);
            });
        });

        describe('when not login', function () {
            it('should redirect to login', function (done) {
                request(app)
                    .get('/threads/create')
                    .expect('Location', '/login')
                    .expect(302, done);
            });
        });
    });

    describe('POST /threads', function () {
        describe('when not login', function () {
            it('should get 302', function (done) {
                request(app)
                    .post('/threads')
                    .send({})
                    .expect(302, done);
            });
        });

        describe('when login', function () {
            describe('when title or body not present', function () {
                it('show get 302', function (done) {
                    loginAsJane
                        .post('/threads')
                        .send({
                            title: undefined,
                            body: undefined
                        })
                        .expect(302, done);
                });
            });

            describe('when title and body present', function () {
                it('should create a thread for user', function (done) {
                    loginAsJane
                        .post('/threads')
                        .send({
                            title: 'Hello',
                            body: 'Foobar'
                        })
                        .end(function (err, res) {
                            if (err) {
                                return done();
                            }

                            Thread.findOne({
                                title: 'Hello',
                                body: 'Foobar'
                            }).then(thread => {
                                expect(thread.title).toEqual('Hello');
                                expect(thread.body).toEqual('Foobar');
                                expect(thread.author.toString()).toEqual(jane._id.toString())
                                done();
                            }).catch(done);
                        });
                });
            });
        });
    });

    describe.skip('GET /threads/:id/edit', function () {
        describe('when login', function () {

            describe('when not owner', function () {
                it('should get 403', function (done) {
                    // ...
                });

            });

            describe('when owner', function () {
                it('should display the edit form', function (done) {
                    // ...
                });
            })

        });

        describe('when not login', function () {
            it('should redirect to login', function (done) {
                // ...
            });
        });
    });

    describe.skip('PUT /threads/:id', function () {
        describe('when login', function () {
            before(function (done) {

            });

            it('should display the edit form', function (done) {
                // ...
            });
        });

        describe('when not login', function () {
            it('should redirect to login', function (done) {
                // ...
            });
        });
    });

    describe.skip('Delete /threads/:id', function () {
        describe('when not login', function () {
            it('should get 401', function (done) {
                // ...
            });
        });

        describe('when login', function () {
            before(function (done) {
                // login
            });

            describe('when not present', function () {
                it('should get 404', function (done) {
                    // ...
                });
            });

            describe('when present', function () {
                describe('when it is creator', function () {
                    before(function (done) {

                    });

                    it('should remove the thread', function (done) {
                        // ...
                    });
                });

                describe('when it is not creator', function (done) {
                    it('should get 405', function (done) {
                        // ...
                    });
                });
            })
        });
    });
});
