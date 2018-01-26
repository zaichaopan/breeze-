const mongoose = require('mongoose');
const activitySchema = require('../db/schemas/activity');
mongoose.Promise = global.Promise;

module.exports = mongoose.model('activity', activitySchema);
