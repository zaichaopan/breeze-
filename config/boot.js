module.exports = (parent, options) => {
    require('./db')(parent, options);
    require('./route')(parent, options);
}
