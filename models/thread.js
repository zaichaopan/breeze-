const slug = require('slug');
const mongoose = require('mongoose');
const threadSchema = require('../db/schemas/thread');
mongoose.Promise = global.Promise;

threadSchema.pre('save', async function (next) {
    if (!this.isModified('title')) {
        next();
        return;
    }

    this.slug = slug(this.sluggables.map(sluggable => this[sluggable].toLowerCase()).join(' '));

    const count = await this.constructor.find({});

    const hasSlugToken = await this.constructor.find({
        slug: this.slug
    })

    if (hasSlugToken.length) {
        this.slug = `${this.slug}-${Date.now()}`;
    }

    next();
});

threadSchema.virtual('sluggables').get(function () {
    return ['title'];
});

module.exports = mongoose.model('thread', threadSchema);
