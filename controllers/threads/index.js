const Thread = require('../../models/thread');
const asyncWrapper = require('../../helper/asyncWrapper');

const findThread = async(req, next) => {
    const {
        _id
    } = req.params;
    const thread = await Thread.findOne({
        _id
    });
    if (!thread) next('route');
    req.thread = thread;
    next();
};

exports.before = {
    show(req, res, next) {
        asyncWrapper(findThread(req, next));
    },
    edit(req, res, next) {
        asyncWrapper(findThread(req, next));
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

exports.show = (req, res, next) => {
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
    });
};

exports.create = (req, res, next) => res.render('threads.create');

exports.edit = (req, res, next) => {
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
}
