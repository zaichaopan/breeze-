module.exports = (parent, options) => {
    require('./session')(parent, options);
    require('./db')(parent, options);
    require('./auth')(parent, options);
    require('./route')(parent, options);
}
