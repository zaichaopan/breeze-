const express = require('express');
const threadsController = require('../controllers/threads');
const resource = require('../helper/resource');
const loginController = require('../auth/login');

module.exports = (parent) => {
    let app = express();

    // auth routing
    app.get('/login', loginController.showLoginForm);
    app.post('/login', loginController.login);

    app.use(resource(threadsController));
    parent.use(app);
}
