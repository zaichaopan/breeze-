const Thread = require('../../models/thread');
const asyncWrapper = require('../../helper/asyncWrapper');

const findThread = async(req, next) => {
    const { _id } = req.params;
    const thread = await Thread.findOne({ _id });
    if (!thread) next('route');
    req.thread = thread;
    next();
}

exports.before = {
    show(req, res, next) {
        asyncWrapper(findThread(req, next))
    }
}

exports.show = (req, res, next) => {
    res.send({ thread: req.thread });
}
