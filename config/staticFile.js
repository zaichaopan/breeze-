const express = require('express');
const path = require('path');

module.exports = (parent, options) => {
    const { verbose } = options;
    const app = express();
    app.use(express.static(path.join(__dirname, '..', 'public')));
    parent.use(app);
    verbose && console.log('static registered successfully');
}


