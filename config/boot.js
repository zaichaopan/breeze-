module.exports = (parent, options) => {
    require('./view')(parent, options);
    require('./staticFile')(parent, options);
    require('./cookie')(parent, options);
    require('./session')(parent, options);
    require('./flash')(parent, options);
    require('./request')(parent, options);
    require('./db')(parent, options);
    require('./auth')(parent, options);
    require('./route')(parent, options);
}
