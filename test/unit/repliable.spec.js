const Reply = require('../../models/reply');
const threadFactory = require('../../db/factories/thread');
const {
    expect
} = require('chai')
const {
    clearDb
} = require('../helper');

describe('repliable plugin', function () {
    let thread;

    beforeEach(async function () {
        await clearDb();

        thread = await threadFactory.create();
    });

    describe('addReply', function () {
        it('should add reply to a model', async function () {
            let reply = await thread.addReply({
                body: 'foo bar',
                author: thread.author
            });

            expect(reply.author).to.equal(thread.author);
            expect(reply.body).to.equal('foo bar');
            expect(reply.subject.kind).to.equal('thread');
            expect(reply.subject.item.toString()).to.equal(thread._id.toString());
        })
    });

    describe('replies', function () {
        it('should get replies of a model', async function () {
            await thread.addReply({
                body: 'foo bar',
                author: thread.author
            });

            let replies = await thread.replies();
            expect(replies.length).to.equal(1);
            expect(replies[0].subject.item._id.toString()).to.be.equal(thread._id.toString());
        });
    })
});
