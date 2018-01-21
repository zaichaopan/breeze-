const Thread = require('../../models/thread');
const auth = require('../../middlewares/auth');
const asyncWrapper = require('../../helper/asyncWrapper');

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

    if (!thread) {
        return next('route');
    }

    req.thread = thread;
    next();
});

exports.before = {
    show(req, res, next) {
        findThread(req, res, next);
    },
    create(req, res, next) {
        auth(req, res, next);
    },
    edit(req, res, next) {
        auth(req, res, next);
        findThread(req, res, next);
    },
    store(req, res, next) {
        auth(req, res, next);
    }
};

exports.index = asyncWrapper(async(req, res, next) => {
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
});

exports.create = (req, res, next) => {
    res.render('threads/create');
};

exports.store = asyncWrapper(async(req, res, next) => {
    let thread = new Thread(req.body);
    thread.author = req.user._id;
    await thread.save();
    res.redirect(`/threads/${thread._id}`);
});

exports.show = (req, res, next) => res.format({
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
});

exports.edit = (req, res, next) => res.format({
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

// update

// destroy
