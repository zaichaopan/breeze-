const asyncWrapper = require('../../helper/asyncWrapper');
const User = require('../../models/user');
const promisify = require('es6-promisify');

module.exports = {
    validResetPassword: (req, res, next) => {
        req.checkBody('password', 'Password Cannot be Blank!').notEmpty();

        req
            .checkBody('password', 'passwords must be at least 6 chars long!')
            .isLength({ min: 6 });

        req
            .checkBody(
                'password_confirmation',
                'Confirmed Password cannot be blank!'
            )
            .notEmpty();

        req
            .checkBody('password_confirmation', 'Your passwords do not match!')
            .equals(req.body.password);

        const errors = req.validationErrors();

        if (errors) {
            req.flash('error', errors.map(err => err.msg));
            res.status(422);

            return res.format({
                html() {
                    res.render('auth/reset-password', {
                        body: req.body,
                        flashes: req.flash()
                    });
                },

                json() {
                    res.send({ errors });
                }
            });
        }

        next();
    },

    showResetForm: asyncWrapper(async (req, res, next) => {
        let user = await User.findOne({
            password_reset_token: req.params.password_reset_token,
            password_reset_expire_at: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Password reset is invalid or has expired');
            return next('route');
        }

        res.render('auth/reset-password', {
            password_reset_token: req.params.password_reset_token
        });
    }),

    reset: asyncWrapper(async (req, res, next) => {
        let user = await User.findOne({
            password_reset_token: req.body.password_reset_token,
            password_reset_expire_at: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Password reset is invalid or has expired');
            return next('route');
        }

        const setPassword = promisify(user.setPassword, user);

        await setPassword(req.body.password);

        user.reset_password_token = null;
        user.reset_password_expire_at = null;
        const updatedUser = await user.save();

        await req.login(updatedUser);

        req.flash(
            'success',
            'Your password has been reset! You are now logged in!'
        );

        res.redirect('/home');
    })
};
