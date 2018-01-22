const Thread = require('../../models/thread');
const auth = require('../../middlewares/auth');
const asyncWrapper = require('../../helper/asyncWrapper');
const checkOwner = require('../../middlewares/checkOwner');

const findThread = asyncWrapper(async(req, res, next) => {
    const {
        _id
    } = req.params;

    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return next('route');
    }

    const thread = await Thread.findOne({
        _id
    });

    //console.log(thread);

    if (!thread) {
        return next('route');
    }

    req.thread = thread;
    next();
});

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

    create: [auth, (req, res, next) => res.render('threads/create')],

    store: [auth, asyncWrapper(async(req, res, next) => {
        let thread = new Thread(req.body);
        thread.author = req.user._id;
        await thread.save();
        res.redirect(`/threads/${thread._id}`);
    })],

    show: [findThread, (req, res, next) => {
        res.format({
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
    }],

    edit: [auth, findThread, (req, res, next) => {
        res.format({
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
        });
    }],
    // update
    // destroy
}
