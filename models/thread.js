const mongoose = require('mongoose');
const threadSchema = require('../db/schemas/thread');
mongoose.Promise = global.Promise;
const slug = require('./plugins/slug');

threadSchema.virtual('sluggables').get(function () {
    return ['title'];
});

threadSchema.plugin(slug);

module.exports = mongoose.model('thread', threadSchema);
