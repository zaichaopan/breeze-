const mongoose = require('mongoose');
const threadSchema = require('../db/schemas/thread');
mongoose.Promise = global.Promise;
const slug = require('./plugins/slug');
const recordActivity = require('./plugins/recordActivity');
const Activity = require('./activity');

threadSchema.virtual('sluggables').get(function () {
    return ['title'];
});

threadSchema.plugin(slug);
threadSchema.plugin(recordActivity);
module.exports = mongoose.model('thread', threadSchema);
