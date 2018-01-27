const expect = require('expect');
const userFactory = require('../../db/factories/user');
const threadFactory = require('../../db/factories/thread');
const Activity = require('../../models/activity');

describe('thread model', function () {
    describe('record activity plugin', function () {
        let threadOne;
        let threadTwo;

        before(async function () {
            threadOne = await threadFactory.create();
            threadTwo = await threadFactory.create();
        });

        describe('when thread created', function () {
            it('records automatically', function (done) {
                threadFactory.create().then(thread => {
                    Activity.findOne({
                            subject: {
                                kind: 'thread',
                                item: thread._id
                            }
                        })
                        .then(activity => {
                            expect(activity).not.toBe(null);
                            done();
                        })
                        .catch(err => done());
                }).catch(err => done());
            });
        });

        describe('activity method', function () {
            it('should get all recorded activity of a thread', function (done) {
                threadOne.activity().then(activity => {
                    expect(activity.length).toEqual(1);
                    expect(activity[0].subject.item._id.toString()).toEqual(threadOne._id.toString());
                    done();
                }).catch(err => done());
            });
        });

        describe('when thread removes', function () {
            it('should its activity', function (done) {
                threadOne.remove()
                    .then(result => {
                        Activity.find({
                                subject: {
                                    kind: 'thread',
                                    item: threadOne._id
                                }
                            })
                            .then(activity => {
                                expect(activity).toBe(null);
                                Activity.find({
                                        subject: {
                                            kind: 'thread',
                                            item: threadTwo._id
                                        }
                                    })
                                    .then(activity => {
                                        expect(activity).not.toBe(null);
                                    }).catch(err => done());
                            }).catch(err => done());
                    }).catch(err => done());
            });
        });
    });


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
                }).catch(err => done());
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
                }).catch(err => done());
            });
        });
    });
});
