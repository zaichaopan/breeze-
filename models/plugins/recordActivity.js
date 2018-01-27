const Activity = require('../../models/activity');

module.exports = (schema) => {
    schema.pre('save', async function (next, user) {
        let {
            _id
        } = user;

        let kind = this.constructor.modelName;
        let type = `created_${kind}`;
        let activity = new Activity({
            type,
            user: _id,
            subject: {
                kind,
                item: this._id
            }
        });

        await activity.save();
        next();
    });

    schema.pre('remove', async function (next) {
        await this.activity().remove();
        next();
    });

    schema.methods.activity = function () {
        return this.model('activity').find({
            subject: {
                kind: this.constructor.modelName,
                item: this._id
            }
        });
    };
};
