const mongoose = require('mongoose');
const threadSchema = require('../db/schemas/thread');
mongoose.Promise = global.Promise;
const slug = require('./plugins/slug');
const recordable = require('./plugins/recordable');

threadSchema.virtual('sluggables').get(function () {
    return ['title'];
});

threadSchema.plugin(slug);
threadSchema.plugin(recordable, {
    recordables: ['save']
});


module.exports = mongoose.model('thread', threadSchema);
