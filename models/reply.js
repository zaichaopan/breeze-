const mongoose = require('mongoose');
const replySchema = require('../db/schemas/reply');
mongoose.Promise = global.Promise;

module.exports = mongoose.model('reply', replySchema);
