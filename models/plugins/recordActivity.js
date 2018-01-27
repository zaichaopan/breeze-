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
};

// Add a instance method to model
// schema.methods.activities = function()
/*
schema.methods.activities = function() {
    return this.model('activity').find({
        subject: {
           kind: this.constructor.modelName,
           item:  this._id
        }
    });
}

schema.pre('delete', async function(next) {
    $activities = await this.activities();
    await $activities.remove();
})

comments
check spam

//static method
Activity.OfUser()
activitySchema.statics.ofUser = function(user) {
    return this.model('activity').find({
        user: user._id
    });
}
*/
