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
                    body
                }
            } = req;

            await req.thread.addComment({
                body
            });

            res.redirect(`/threads/${req.thread._id}`);
        })
    },

    update: {
        url: '/thread/:threadId/replies/replyId',

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
        url: '/thread/:threadId/replies/replyId',

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
