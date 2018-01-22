module.exports = (req, res, next, modelName, foreignKey = 'user') => {
    console.log('in check Owner');
    let model = req[modelName];
    console.log(model);
    if (model[foreignKey].toString() === req.user._id.toString()) {
        console.log('status');
        res.status(403);
        console.log('status');
        return next('route');
    }

    next();
}
