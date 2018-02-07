const express = require('express');
const resource = require('../helper/resource');
const homeController = require('../controllers/home');
const threadsController = require('../controllers/threads');
const repliesController = require('../controllers/replies');
const userAvatars = require('../controllers/userAvatars');
const guest = require('../middlewares/guest');
const { showLoginForm, login } = require('../controllers/auth/login');
const confirmEmail = require('../controllers/auth/emailConfirmation');
const {
    showRegisterForm,
    validateRegister,
    checkUserExists,
    register
} = require('../controllers/auth/register');

module.exports = parent => {
    let app = express();

    // auth routing
    app.get('/login', guest, showLoginForm);
    app.post('/login', guest, login);

    app.get('/register', guest, showRegisterForm);
    app.post('/register', guest, validateRegister, checkUserExists, register);
    app.get('/register/confirmation/:confirmation_token', confirmEmail, login);

    app.use(resource(homeController));
    app.use(resource(threadsController));
    app.use(resource(repliesController));
    app.use(resource(userAvatars));
    parent.use(app);
};
