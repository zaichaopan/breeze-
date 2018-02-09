const { Schema } = require('mongoose');

module.exports = new Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Please enter channel name!']
        },
        slug: {
            type: String,
            unique: true
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);
