const auth = require('../../middlewares/auth');
const Thread = require('../../models/thread');
const asyncWrapper = require('../../helper/asyncWrapper');
const checkOwner = require('../../middlewares/checkOwner');
const loadModel = require('../../middlewares/loadModel');

module.exports = {
    index: {
        url: '/threads',
        handler: asyncWrapper(async (req, res, next) => {
            const threads = await Thread.find({});
            res.format({
                html() {
                    res.render('threads/index', {
                        threads
                    });
                },
                json() {
                    res.send({
                        threads
                    });
                }
            });
        }),
    },

    create: {
        url: '/threads/create',
        before: [auth],
        handler: (req, res, next) => res.render('threads/create')
    },

    store: {
        url: '/threads',
        before: [auth],
        handler: asyncWrapper(async (req, res, next) => {
            let thread = new Thread(req.body);
            thread.author = req.user._id;
            await thread.save(req.user);
            res.redirect(`/threads/${thread._id}`);
        })
    },

    show: {
        url: '/threads/:threadId',
        before: [
            asyncWrapper(loadModel({
                model: 'thread'
            }))
        ],
        handler: (req, res, next) => res.format({
            html() {
                res.render('threads/index', {
                    thread: req.thread
                });
            },
            json() {
                res.send({
                    thread: req.thread
                });
            }
        })
    },

    edit: {
        url: '/threads/:threadId/edit',
        before: [
            auth,
            asyncWrapper(loadModel({
                model: 'thread'
            })),
            checkOwner({
                name: 'thread',
                foreignKey: 'author'
            }),
        ],

        handler: (req, res, next) => res.format({
            html() {
                res.render('threads/edit', {
                    thread: req.thread
                });
            },
            json() {
                res.send({
                    thread: req.thread
                });
            }
        })
    },

    update: {
        url: '/threads/:threadId',
        before: [
            auth,
            asyncWrapper(loadModel({
                model: 'thread'
            })),
            checkOwner({
                name: 'thread',
                foreignKey: 'author'
            })
        ],
        handler: asyncWrapper(async (req, res, next) => {
            let thread = req.thread;
            await thread.update(req.body);
            await thread.save();
            res.redirect(`/threads/${thread._id}`);
        })
    },

    destroy: {
        url: '/threads/:threadId',
        before: [
            auth,
            asyncWrapper(loadModel({
                model: 'thread'
            })),
            checkOwner({
                name: 'thread',
                foreignKey: 'author'
            }),
        ],
        handler: asyncWrapper(async (req, res, next) => {
            let thread = req.thread;
            await thread.remove();
            res.redirect('/threads');
        })
    }
}
