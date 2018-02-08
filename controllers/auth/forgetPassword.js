const asyncWrapper = require('../../helper/asyncWrapper');
const User = require('../../models/user');
const mail = require('../../helper/mail');
const crypto = require('crypto');

module.exports = {
    showForgetPasswordForm: (req, res) => {
        res.render('auth/forget-password');
    },

    sendResetPasswordLink: asyncWrapper(async (req, res) => {
        let user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            res.status(302);
            req.flash(
                'error',
                `User with the given email: ${req.body.email} cannot found!`
            );
            return res.redirect('back');
        }

        user.password_reset_token = crypto.randomBytes(20).toString('hex');
        user.password_reset_expire_at = Date.now() + 3600000;

        await user.save();

        const URL = `http://${req.headers.host}/password-reset/${
            user.password_reset_token
        }`;


        await mail.send({
            user,
            filename: 'reset-password',
            subject: 'Password Reset',
            URL
        });

        req.flash('success', `You have been emailed a password reset link.`);

        return res.redirect('back');
    })
};
