const app = require('../../app');
const expect = require('expect');
const request = require('supertest');
const Thread = require('../../models/thread');
const threadFactory = require('../../db/factories/thread');
const User = require('../../models/user');
const userFactory = require('../../db/factories/user');
const promisify = require('es6-promisify');


describe('threads', function () {
    let thread;
    let user;
    let authenticatedUser = request.agent(app);
    before(async function () {
        thread = threadFactory.make({
            title: 'foobar'
        });
        user = userFactory.make({
            email: 'jane@example.com'
        });
        const register = promisify(User.register, User);
        await thread.save();
        await register(user, 'password');
        await authenticatedUser
            .post('/login')
            .send({
                email: 'jane@example.com',
                password: 'password'
            })
            .expect('Location', '/threads')
            .expect(302)
    });

    describe('GET /threads', function () {
        it('should display a list of threads', function (done) {
            request(app).get('/threads')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.threads.map(item => item._id.toString())).toContain(thread._id.toString());
                    done();
                });
        });
    });

    describe('GET /threads/:id', function () {
        describe('when present', function () {
            it('should display the thread', function (done) {
                request(app)
                    .get(`/threads/${thread._id}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) return done();
                        expect(res.body.thread._id.toString()).toEqual(thread._id.toString());
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
                authenticatedUser
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

    describe.only('POST /threads', function () {
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
                it('show show validation error', function () {

                    let error = new Thread({
                        title: undefined,
                        body: undefined
                    }).validateSync();
                    
                    expect(error.errors['title'].message).toEqual('Please enter thread title!');
                    expect(error.errors['body'].message).toEqual('Please enter thread body!');

                    error = new Thread({
                        title: '',
                        body: ''
                    }).validateSync();

                    expect(error.errors['title'].message).toEqual('Please enter thread title!');
                    expect(error.errors['body'].message).toEqual('Please enter thread body!');
                });
            });

            describe.skip('when title and body present', function () {
                it('should create a thread', function (done) {
                    let attributes = {
                        title: 'Hello',
                        body: 'Foobar'
                    };

                    authenticatedUser
                        .post('/threads')
                        .send(attributes)
                        .end(function (err, res) {
                            if (err) {
                                done();
                            } else {
                                Thread.findOne(attributes).then(thread => {
                                    expect(thread).toBeTruthy();
                                    done();
                                }).catch(done);
                            }
                        });
                });
            });
        });
    });

    describe.skip('GET /threads/:id/edit', function () {
        describe('when login', function () {
            before(function (done) {

            });

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
