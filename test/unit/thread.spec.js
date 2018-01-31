const userFactory = require('../../db/factories/user');
const threadFactory = require('../../db/factories/thread');
const Activity = require('../../models/activity');
const {
    expect
} = require('chai');

describe('thread model', function () {
    describe('record activity plugin', function () {
        let threadOne;
        let threadTwo;

        before(async function () {
            threadOne = await threadFactory.create();
            threadTwo = await threadFactory.create();
        });

        describe('when thread created', function () {
            it('records automatically', async function () {
                let thread = await threadFactory.create();
                let activity = Activity.findOne({
                    subject: {
                        kind: 'thread',
                        item: thread._id
                    }
                });

                expect(activity).to.not.be.null;
            });
        });

        describe('activity method', function () {
            it('should get all recorded activity of a thread', async function () {
                let activity = await threadOne.activity();
                expect(activity.length).to.equal(1);
                expect(activity[0].subject.item._id.toString()).to.equal(threadOne._id.toString());
            });
        });

        describe('when thread removes', function () {
            it('should its activity', async function () {
                await threadOne.remove();
                let threadOneActivity = await Activity.find({
                    subject: {
                        kind: 'thread',
                        item: threadOne._id
                    }
                });

                let threadTwoActivity = await Activity.find({
                    subject: {
                        kind: 'thread',
                        item: threadTwo._id
                    }
                });

                expect(threadOneActivity).to.be.empty;
                expect(threadTwoActivity).to.not.be.null;
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
            it('adds a slug using sluggables', async function () {
                let thread = await threadFactory.create({
                    title: 'bar baz',
                    author: user._id
                });

                expect(thread.slug).to.equal('bar-baz');
            });
        });

        describe('when token', function () {
            it('add a slug using sluggables and current time stamp', async function () {
                let thread = await threadFactory.create({
                    title: 'foo bar',
                    author: user._id
                });

                expect(thread.slug.includes('foo-bar')).to.be.true;
                expect(thread.slug).to.not.equal('foo-bar');
            });
        });
    });
});
