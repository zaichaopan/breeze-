const slug = require('slug');

module.exports = schema => {
    schema.pre('save', async function(next) {
        if (!this.isModified('title')) {
            return next();
        }

        this.slug = slug(
            this.sluggables
                .map(sluggable => this[sluggable].toLowerCase())
                .join(' ')
        );

        const hasSlugToken = await this.constructor.find({
            slug: this.slug
        });

        if (hasSlugToken.length) {
            this.slug = `${this.slug}-${Date.now()}`;
        }

        next();
    });
};
