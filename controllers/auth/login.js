const passport = require('passport');

module.exports = {
    showLoginForm: (req, res) => res.render('auth/login'),
    login: passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Failed Login',
        successRedirect: '/home',
        successFlash: 'You are now logged in!',
        failureFlash: 'These credentials do not match our records.'
    })
};
