const User = require('../../models/user');
const asyncWrapper = require('../../helper/asyncWrapper');

module.exports = asyncWrapper(async (req, res, next) => {
    let user = await User.findOne({
        confirmation_token: req.params.confirmation_token
    });

    if (!user) {
        return next('route');
    }

    await user.update({
        confirmation_token: null,
        is_confirmed: true
    });

    req.flash('success', 'Your email has been confirmed. Please login!')
    res.redirect('/login');
});
