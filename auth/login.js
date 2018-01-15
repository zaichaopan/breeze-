const passport = require('passport');

const showLoginForm= (req, res) => res.render('auth/login');

const login= passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login',
    successRedirect: '/',
    successFlash: 'You are now logged in'
});

module.exports = {
    showLoginForm,
    login
}
