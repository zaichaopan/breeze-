const promisify = require('es6-promisify');
const app = require('../../app');
const expect = require('expect');
const request = require('supertest');
const Thread = require('../../models/thread');

describe('create thread', () => {
    const authenticatedUser = request.agent(app);
    before((done) => {
        authenticatedUser
            .post('/login')
            .send({
                email: 'john@example.com',
                password: 'password'
            })
            .expect('Location', '/threads')
            .expect(302)
            .end((err, res) => {
                done();
            });
    });

    it('shows create thread form for authenticated user', (done) => {
        authenticatedUser
            .get('/threads/create')
            .expect(200, done);
    })
});
