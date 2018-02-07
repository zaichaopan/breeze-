const express = require('express');
const resource = require('../helper/resource');
const homeController = require('../controllers/home');
const threadsController = require('../controllers/threads');
const repliesController = require('../controllers/replies');
const userAvatars = require('../controllers/userAvatars');
const guest = require('../middlewares/guest');
const {
    showRegisterForm,
    validateRegister,
    checkUserExists,
    register
} = require('../controllers/auth/register');
const { showLoginForm, login } = require('../controllers/auth/login');

module.exports = parent => {
    let app = express();

    // auth routing
    app.get('/login', showLoginForm);
    app.post('/login', login);

    app.get('/register', showRegisterForm);
    app.post('/register', guest, validateRegister, checkUserExists, register);

    app.use(resource(homeController));
    app.use(resource(threadsController));
    app.use(resource(repliesController));
    app.use(resource(userAvatars));
    parent.use(app);
};
