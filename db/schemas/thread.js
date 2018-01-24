const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema =
    new Schema({
        title: {
            type: String,
            trim: true,
            required: [true, 'Please enter thread title!']
        },
        slug: String,
        body: {
            type: String,
            trim: true,
            required: 'Please enter thread body!'
        },

        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: 'You must supply an author'
        }
    }, {
        timestamps: true
    });

module.exports = threadSchema;
