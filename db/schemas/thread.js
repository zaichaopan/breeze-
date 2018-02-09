const { Schema } = require('mongoose');

module.exports = new Schema(
    {
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
            type: Schema.ObjectId,
            ref: 'user',
            required: 'You must supply an author'
        }
    },
    {
        timestamps: true
    }
);
