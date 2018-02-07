const User = require('../../models/user');
const asyncWrapper = require('../../helper/asyncWrapper');
const promisify = require('es6-promisify');
const email = require('../../helper/mail');
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
            .isLength({ min: 5 });

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
                    res.render('auth/register', {
                        title: 'Register',
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
                res.send({
                    errors: [
                        {
                            param: exist,
                            msg
                        }
                    ]
                });
            }
        });
    }),

    register: asyncWrapper(async (req, res) => {
        console.log('inside controller');
        const user = new User({ email: req.body.email, name: req.body.name });
        const register = promisify(User.register, User);

        user.confirmationToken = crypto.randomBytes(20).toString('hex');
        user.confirmationExpires = Date.now() + 3600000; // 1 hour from now

        await register(user, req.body.password);

        const redirectURL = `http://${req.headers.host}/confirmation/${
            user.confirmationToken
        }`;

        await mail.send({
            filename: 'register-confirmation',
            to: req.body.email,
            subject: 'Register Confirmation',
            redirectURL
        });

        req.flash(
            'success',
            `You have registered successfully! Please check your email ${
                req.body.email
            } for the confirmation email.`
        );

        res.redirect('back');
    })
};
