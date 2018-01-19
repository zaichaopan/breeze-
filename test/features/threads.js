const app = require('../../app');
const expect = require('expect');
const request = require('supertest');
const Thread = require('../../models/thread');
const threadFactory = require('../../db/factories/thread');

describe('threads', function () {
    let thread;

    before(async function () {
        thread = threadFactory.make({
            title: 'foobar'
        });
        await thread.save();
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
        describe('when preset', function () {
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

    describe.skip('GET /threads/create', function () {
        describe('when login', function () {
            before(function (done) {

            });

            it('should display the create form', function (done) {
                // ...
            });
        });

        describe('when not login', function () {
            it('should redirect to login', function (done) {
                // ...
            });
        });
    });

    describe.skip('GET /threads/:id/edit', function () {
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
