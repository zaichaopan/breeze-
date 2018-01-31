const mongoose = require('mongoose');
const threadSchema = require('../db/schemas/thread');
mongoose.Promise = global.Promise;
const slug = require('./plugins/slug');
const recordActivity = require('./plugins/recordActivity');
const repliable = require('./plugins/repliable');
const Activity = require('./activity');

threadSchema.virtual('sluggables').get(function () {
    return ['title'];
});

threadSchema.plugin(slug);
threadSchema.plugin(recordActivity);
threadSchema.plugin(repliable);
module.exports = mongoose.model('thread', threadSchema);
