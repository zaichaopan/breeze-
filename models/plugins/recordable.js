const Activity = require('../../models/activity');

module.exports = (schema, options) => {
    let {
        recordables
    } = options;

    recordables.forEach(recordable => {
        schema.pre(recordable, async function (next, user) {
            let {
                _id
            } = user;

            let kind = this.constructor.modelName;
            let type = `${recordable}_${kind}`;
            let activity = new Activity({
                user: _id,
                type,
                subject: {
                    kind,
                    item: this._id
                }
            });

            await activity.save();
            next();
        });
    });
};
