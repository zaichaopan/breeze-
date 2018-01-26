const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    subject: {
        kind: String,
        item: {
            type: mongoose.Schema.ObjectId,
            refPath: 'subject.kind'
        }
    },
    type: String
}, {
    timestamps: true
});

module.exports = activitySchema;


// look for ref path for dynamic ref
// http://mongoosejs.com/docs/populate.html
