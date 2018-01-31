const User = require('../../models/user');
const Thread = require('../../models/thread');
const Activity = require('../../models/activity');
const {
    expect
} = require('chai');

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
            _id: user._id
        });
    });

    it('should populate correct subject', async function () {
        let activity = await Activity.findOne({
            user: user._id
        }).populate('subject.item');

        expect(activity.subject.item._id.toString()).to.equal(thread._id.toString());
    });
});
