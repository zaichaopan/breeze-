const User = require('../../models/user');
const asyncWrapper = require('../../helper/asyncWrapper');

module.exports = asyncWrapper(async (req, res, next) => {
    let user = await User.findOneAndUpdate(
        { confirmation_token: req.params.confirmation_token },
        { $set: { confirmation_token: null, is_confirmed: true } }
    );

    if (!user) {
        return next('route');
    }

    req.flash('success', 'Your email has been confirmed. Please login!');
    res.redirect('/login');
});
