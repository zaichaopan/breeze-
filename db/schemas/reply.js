const {
    Schema
} = require('mongoose');

module.exports = new Schema({
    author: {
        type: Schema.ObjectId,
        ref: 'user',
        required: 'You must supply an author'
    },

    body: {
        type: String,
        trim: true,
        required: [true, 'Please enter reply body']
    },

    subject: {
        kind: String,
        item: {
            type: Schema.ObjectId,
            refPath: 'subject.kind'
        }
    }
}, {
    timestamps: true
});
