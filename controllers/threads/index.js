const Thread = require('../../models/thread');
const auth = require('../../middlewares/auth');
const asyncWrapper = require('../../helper/asyncWrapper');
const checkOwner = require('../../middlewares/checkOwner');
const loadModel = require('../../middlewares/loadModel');

module.exports = {
    index: asyncWrapper(async(req, res, next) => {
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

    create: [
        auth,
        (req, res, next) => res.render('threads/create')
    ],

    store: [
        auth,
        asyncWrapper(async(req, res, next) => {
            let thread = new Thread(req.body);
            thread.author = req.user._id;
            await thread.save();
            res.redirect(`/threads/${thread._id}`);
        })
    ],

    show: [
        asyncWrapper(loadModel({
            model: 'thread'
        })),
        (req, res, next) => res.format({
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
    ],

    edit: [
        auth,
        asyncWrapper(loadModel({
            model: 'thread'
        })),
        checkOwner({
            name: 'thread',
            foreignKey: 'author'
        }),
        (req, res, next) => res.format({
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
    ],
    update: [
        auth,
        asyncWrapper(loadModel({
            model: 'thread'
        })),
        checkOwner({
            name: 'thread',
            foreignKey: 'author'
        }),
        asyncWrapper(async(req, res, next) => {
            let thread = req.thread;
            await thread.update(req.body);
            await thread.save();
            res.redirect(`/threads/${thread._id}`);
        })
    ],
    destroy: [
        auth,
        asyncWrapper(loadModel({
            model: 'thread'
        })),
        checkOwner({
            name: 'thread',
            foreignKey: 'author'
        }),
        asyncWrapper(async(req, res, next) => {
            let thread = req.thread;
            await thread.remove();
            res.redirect('/threads');
        })
    ]
}
