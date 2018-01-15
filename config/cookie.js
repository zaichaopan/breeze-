const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = (parent, options) => {
    const { verbose } = options;
    const app = express();
    app.use(cookieParser());
    parent.use(app);
    verbose && console.log('cookie registered successfully');
}
