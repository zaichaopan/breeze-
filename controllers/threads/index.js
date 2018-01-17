const Thread = require('../../models/thread');
const auth = require('../../middlewares/auth');
const asyncWrapper = require('../../helper/asyncWrapper');

const findThread = async(req, next) => {
    const { _id } = req.params;
    const thread = await Thread.findOne({ _id });
    if (!thread) next('route');
    req.thread = thread;
    next();
};

exports.before = {
    show(req, res, next) {
        asyncWrapper(findThread(req, next));
    },
    create(req, res, next) {
        auth(req, res, next);
    },
    edit(req, res, next) {
        auth(req, res, next);
        asyncWrapper(findThread(req, next));
    }
};

exports.index = asyncWrapper(async(req, res, next) => {
    const threads = await Thread.find({});
    res.format({
        html() { res.render('threads/index', { threads }); },
        json() { res.send({ threads }); }
    });
});

exports.create = (req, res, next) => {
    // console.log('in create');
    // console.log(req.isAuthenticated());
    res.send('hello')
    //res.render('threads.create');
}

// exports.store

exports.show = (req, res, next) => res.format({
    html() { res.render('threads/index', { thread: req.thread }); },
    json() { res.send({ thread: req.thread }); }
});

exports.edit = (req, res, next) => res.format({
    html() { res.render('threads/edit', { thread: req.thread }); },
    json() { res.send({ thread: req.thread }); }
});

// update

// destroy
