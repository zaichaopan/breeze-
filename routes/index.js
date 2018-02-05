const express = require('express');
const resource = require('../helper/resource');
const loginController = require('../auth/login');
const threadsController = require('../controllers/threads');
const repliesController = require('../controllers/replies');
const userAvatars = require('../controllers/userAvatars');


module.exports = (parent) => {
    let app = express();

    // auth routing
    app.get('/login', loginController.showLoginForm);
    app.post('/login', loginController.login);

    app.use(resource(threadsController));
    app.use(resource(repliesController));
    app.use(resource(userAvatars));
    parent.use(app);
}
