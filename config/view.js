const express = require('express');
const path = require('path');

module.exports = (parent, options) => {
    const { verbose } = options;
    const app = express();
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '..','views'));
    parent.use(app);
    verbose && console.log('view successfully');
}
