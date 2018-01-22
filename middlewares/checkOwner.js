module.exports = (options) => {
    return function (req, res, next) {
        let { name, foreignKey } = options;

        if (req[name][foreignKey].toString() === req.user._id.toString()) {
            return next();
        }

        res.status(403);
        return next('route');
    };
}
