const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema =
    new Schema({
        title: String,
        body: String
    }, {
            timestamps: true
        });

module.exports = threadSchema;
