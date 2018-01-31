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
        ],
    }
}
