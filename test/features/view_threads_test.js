const app = require('../../app');
const expect = require('expect');
const request = require('supertest');
const Thread = require('../../models/thread');
const threadFactory = require('../../db/factories/thread');

describe('view threads', () => {
    let thread;

    beforeEach((done) => {
        thread = threadFactory.make({
            title: 'foobar'
        });
        thread.save().then(() => {
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
});
