const express = require('express');
const bodyParse = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

module.exports = (parent, options) => {
    const { verbose } = options;
    const app = express();
    app.use(bodyParse.json());
    app.use(bodyParse.urlencoded({extended: true}));
    // allow overriding methods in query (?_method=put/delete)
    app.use(methodOverride('_method'));
    parent.use(app);
    verbose && console.log('request registered successfully');
}
