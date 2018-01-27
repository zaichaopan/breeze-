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
    this.timeout(5000);

    let jane;
    let john;
    let threadByJane;
    let threadByJohn;
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


        threadByJane = await threadFactory.create({
            title: 'foobar',
            author: jane._id
        });
        threadByJohn = await threadFactory.create({
            title: 'foobar',
            author: john._id
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
                    if (err) {
                        return done(err);
                    }
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
                        if (err) {
                            return done();
                        }
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


    describe('GET /threads/:id/edit', function () {
        describe('when login', function () {
            describe('when not owner', function () {
                it('should get 403', function (done) {
                    loginAsJane
                        .get(`/threads/${threadByJohn._id}/edit`)
                        .expect(403, done)
                });
            });

            describe('when owner', function () {
                it('should display the edit form', function (done) {
                    loginAsJane
                        .get(`/threads/${threadByJane._id}/edit`)
                        .expect(200, done)
                });
            });
        });

        describe('when not login', function () {
            it('should redirect to login', function (done) {
                request(app)
                    .get(`/threads/${threadByJohn._id}/edit`)
                    .expect('Location', '/login')
                    .expect(302, done)
            });
        });
    });

    describe('PUT /threads/:id', function () {
        describe('when login', function () {
            describe('when not creator', function () {
                it('should get 403', function (done) {
                    loginAsJane
                        .post(`/threads/${threadByJohn._id}?_method=PUT`)
                        .send({})
                        .expect(403, done);
                });
            });

            describe('when creator', function () {
                describe('when title and body not present', function () {
                    it('should get 302', function (done) {
                        loginAsJane
                            .post(`/threads/${threadByJane._id}?_method=PUT`)
                            .send({})
                            .expect(302, done);
                    });
                });

                describe('when title and body present', function () {
                    it('should get thread for the creator', function (done) {
                        loginAsJane
                            .post(`/threads/${threadByJane._id}?_method=PUT`)
                            .send({
                                title: 'new title',
                                body: 'new body'
                            })
                            .end(function (err, res) {
                                if (err) {
                                    return done;
                                }
                                Thread.findOne({
                                    _id: threadByJane._id
                                }).then(newThread => {
                                    expect(newThread.title).toEqual('new title');
                                    expect(newThread.body).toEqual('new body');
                                    done()
                                });
                            });
                    });
                });
            })
        });

        describe('when not login', function () {
            it('should redirect to login', function (done) {
                request(app)
                    .post(`/threads/${threadByJane._id}?_method=PUT`)
                    .send({})
                    .expect('Location', '/login')
                    .expect(302, done);
            });
        });
    });

    describe('Delete /threads/:id', function () {
        describe('when not login', function () {
            it('should redirect to login', function (done) {
                request(app)
                    .post(`/threads/${threadByJane._id}?_method=DELETE`)
                    .send({})
                    .expect('Location', '/login')
                    .expect(302, done);
            });
        });

        describe('when login', function () {
            describe('when not present', function () {
                it('should get 404', function (done) {
                    loginAsJane
                        .post(`/threads/abc?_method=DELETE`)
                        .send({})
                        .expect(404, done);
                });
            });

            describe('when present', function () {
                describe('when it is creator', function () {
                    it('should remove the thread for the creator', function (done) {
                        loginAsJane
                            .post(`/threads/${threadByJane._id}?_method=DELETE`)
                            .send({})
                            .end(function (err, res) {
                                console.log('called called called');
                                if (err) {
                                    console.log(err);
                                    return done();
                                }
                                Thread.findOne({
                                    _id: threadByJane._id
                                }).then(item => {
                                    expect(item).toBeNull();
                                    done();
                                }).catch(err => {
                                    console.log(err);
                                });
                            });
                    });
                });

                describe('when it is not creator', function (done) {
                    it('should get 403', function (done) {
                        loginAsJane
                            .post(`/threads/${threadByJohn._id}?_method=DELETE`)
                            .send({})
                            .expect(403, done);
                    });
                });
            });
        });
    });
});
