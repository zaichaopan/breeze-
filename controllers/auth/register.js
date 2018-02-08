const User = require('../../models/user');
const asyncWrapper = require('../../helper/asyncWrapper');
const promisify = require('es6-promisify');
const mail = require('../../helper/mail');
const crypto = require('crypto');

module.exports = {
    showRegisterForm: (req, res) => {
        res.render('auth/register', { title: 'Register' });
    },

    validateRegister: (req, res, next) => {
        req.sanitizeBody('name');

        req.checkBody('name', 'You must supply a name!').notEmpty();

        req.checkBody('email', 'That Email is not valid!').isEmail();

        req.sanitizeBody('email').normalizeEmail({
            gmail_remove_dots: false,
            remove_extension: false,
            gmail_remove_subaddress: false
        });

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
                    res.render('back', {
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

    checkUserExists: asyncWrapper(async (req, res, next) => {
        let user = await User.findOne({
            $or: [{ name: req.body.name }, { email: req.body.email }]
        });

        if (!user) {
            return next();
        }

        let exist = user.name === req.body.name ? 'name' : 'email';

        let msg = `A user with the given ${exist} is already registered!`;

        req.flash('error', msg);

        res.status(422);

        return res.format({
            html() {
                res.redirect('back');
            },
            json() {
                res.send({ errors: [{ param: exist, msg }] });
            }
        });
    }),

    register: asyncWrapper(async (req, res) => {
        const user = new User({ email: req.body.email, name: req.body.name });

        const register = promisify(User.register, User);

        user.confirmation_token = crypto.randomBytes(20).toString('hex');
        user.confirmation_expire_at = Date.now() + 3600000;

        await register(user, req.body.password);

        const URL = `http://${req.headers.host}/register/confirmation/${
            user.confirmation_token
        }`;

        await mail.send({
            filename: 'register-confirmation',
            user,
            subject: 'Register Confirmation',
            URL
        });

        req.flash(
            'success',
            `You have registered successfully! Please check your email ${
                req.body.email
            } for the confirmation email.`
        );

        res.status(201);
        return res.redirect('back');
    })
};
