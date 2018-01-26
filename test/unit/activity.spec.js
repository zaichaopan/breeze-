const expect = require('expect');
const User = require('../../models/user');
const Thread = require('../../models/thread');
const Activity = require('../../models/activity');

describe('activity model', function () {
    let thread;
    let user;

    before(async function () {
        user = new User({
            email: 'jane@example.com',
            name: 'jame'
        });

        thread = await new Thread({
            title: 'Hello',
            body: 'foobar',
            author: user._id
        }).save({
            user
        });
    });

    it('should populate correct subject', function (done) {
        Activity.findOne({
            user: user._id
        }).populate('subject.item').then(activity => {
            expect(activity.subject.item._id.toString()).toEqual(thread._id.toString());
            done();
        }).catch(err => {
            done();
        });
    });
});
