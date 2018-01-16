const promisify = require('es6-promisify');
const app = require('../../app');
const expect = require('expect');
const request = require('supertest');
const Thread = require('../../models/thread');
const userFactory = require('../../db/factories/user');
const threadFactory = require('../../db/factories/thread');
const User = require('../../models/user')

describe('view threads', () => {
    let thread;
    let user;

    beforeEach((done) => {
        thread = threadFactory.make({
            title: 'foobar'
        });

        user = userFactory.make();
        const register = promisify(User.register, User);

        Promise.all([
            thread.save(), register(user, 'password')
        ]).then((result) => {
            done();
        });

    });

    it('shows threads', (done) => {
        request(app)
            .get('/threads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                expect(res.body.threads.map(item => item._id.toString())).toContain(thread._id.toString());
                done();
            });
    });

    it('shows a thread', (done) => {
        request(app)
            .get(`/threads/${thread._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                expect(res.body.thread._id.toString()).toEqual(thread._id.toString());
                done();
            });
    });

    it('redirect guests to login when accessing create thread form', (done) => {
        request(app)
            .get('/threads/create')
            .expect('Location', '/login')
            .expect(302, done);
    });
});
