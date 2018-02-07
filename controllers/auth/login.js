const passport = require('passport');

// const login = passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: 'Failed Login',
//     successRedirect: '/threads',
//     successFlash: 'You are now logged in'
// });

module.exports = {
    showLoginForm: (req, res) => res.render('auth/login'),
    login: passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Failed Login',
        successRedirect: '/threads',
        successFlash: 'You are now logged in'
    })
};
