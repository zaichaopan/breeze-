const auth = require('../../middlewares/auth');
const Thread = require('../../models/thread');
const asyncWrapper = require('../../helper/asyncWrapper');
const checkOwner = require('../../middlewares/checkOwner');
const loadModel = require('../../middlewares/loadModel');

module.exports = {
    store: {
        url: '/threads/:threadId/replies',

        before: [
            auth,
            asyncWrapper(loadModel({
                model: 'thread'
            }))
        ],

        handler: asyncWrapper(async (req, res, next) => {
            let {
                body: {
                    body = ''
                },
                user: {
                    _id: author
                }
            } = req;

            await req.thread.addReply({
                body,
                author
            });

            res.redirect(`/threads/${req.thread._id}`);
        })
    },

    update: {
        url: '/threads/:threadId/replies/:replyId',

        before: [
            auth,

            asyncWrapper(loadModel({
                model: 'thread'
            })),

            asyncWrapper(loadModel({
                model: 'reply'
            })),

            checkOwner({
                name: 'reply',
                foreignKey: 'author'
            })
        ],

        handler: asyncWrapper(async (req, res, next) => {
            await req.reply.update(req.body);
            res.redirect(`/threads/${req.thread._id}`);
        })
    },

    destroy: {
        url: '/threads/:threadId/replies/:replyId',

        before: [
            auth,

            asyncWrapper(loadModel({
                model: 'thread'
            })),

            asyncWrapper(loadModel({
                model: 'reply'
            })),

            checkOwner({
                name: 'reply',
                foreignKey: 'author'
            })
        ],

        handler: asyncWrapper(async (req, res, next) => {
            await req.reply.remove();
            res.redirect(`/threads/${req.thread._id}`);
        })
    }
}
