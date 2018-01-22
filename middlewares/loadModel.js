const path = require('path');

module.exports = (options) => {
    return async function (req, res, next) {
        let {
            model
        } = options;

        let {
            _id
        } = req.params;

        if (!_id.match(/^[0-9a-fA-F]{24}$/)) return next('route');

        let dir = path.join(__dirname, '..', 'models');
        let file = path.join(dir, model);
        const Model = require(file);
        const item = await Model.findOne({
            _id
        });

        if (!item) return next('route');

        req[model] = item;

        next();
    }

}
