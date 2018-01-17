const mongoose = require('mongoose');
const threadSchema = require('../db/schemas/thread');
mongoose.Promise = global.Promise;
const Thread = mongoose.model('thread', threadSchema);

module.exports = Thread;
