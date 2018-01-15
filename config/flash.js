const express = require('express');
const flash = require('connect-flash');

module.exports = (parent, options) => {
    const { verbose } = options;
    const app = express();
    app.use(flash());
    parent.use(app);
    verbose && console.log('flash registered successfully');
}
