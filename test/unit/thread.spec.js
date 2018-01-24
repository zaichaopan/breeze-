const Thread = require('../../models/thread');
const expect = require('expect');
const userFactory = require('../../db/factories/user');
const threadFactory = require('../../db/factories/thread');

describe.only('thread model', function () {
    describe('add slug', function () {
        let thread;
        let user;

        before(async function () {
            user = await userFactory.create();

            thread = await threadFactory
                .create({
                    title: 'Foo Bar',
                    author: user._id
                });
        });

        describe('when not token', function () {
            it('adds a slug using sluggables', function (done) {
                threadFactory.create({
                    title: 'bar baz',
                    author: user._id
                }).then(thread => {
                    expect(thread.slug).toEqual('bar-baz');
                    done();
                });
            });
        });

        describe('when token', function () {
            it('add a slug using sluggables and current time stamp', function (done) {
                threadFactory.create({
                    title: 'foo bar',
                    author: user._id
                }).then(thread => {
                    expect(thread.slug.includes('foo-bar')).toBeTruthy();
                    expect(thread.slug).not.toBe('foo-bar');
                    done();
                });

            });
        });
    });
});
