module.exports = schema => {
    schema.methods.addReply = function({body, author}) {
        return this.model('reply').create({
            body,
            author,
            subject: {
                kind: this.constructor.modelName,
                item: this._id
            }
        });
    };

    schema.methods.replies = function() {
        return this.model('reply')
            .find({
                subject: {
                    kind: this.constructor.modelName,
                    item: this._id
                }
            })
            .populate('subject.item');
    };
};
