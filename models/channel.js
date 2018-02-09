const mongoose = require('mongoose');
const channelSchema = require('../db/schemas/channel');
mongoose.Promise = global.Promise;
const slug = require('./plugins/slug');

channelSchema.virtual('sluggables').get(function() {
    return ['name'];
});
channelSchema.plugin(slug);

module.exports = mongoose.model('channel', channelSchema);
