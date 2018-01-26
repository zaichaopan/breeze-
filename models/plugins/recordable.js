const Activity = require('../../models/activity');

module.exports = (schema, options) => {
    let {
        recordables
    } = options;

    recordables.forEach(recordable => {
        schema.pre(recordable, async function (next, req) {

            // handle test
            let {
                user = {
                    _id: null
                }
            } = req;

            let kind = this.constructor.modelName;
            let type = `${recordable}_${kind}`;
            let activity = new Activity({
                user: user._id,
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
