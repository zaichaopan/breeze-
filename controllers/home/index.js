const auth = require('../../middlewares/auth');

module.exports = {
    index: {
        url: '/home',
        before: [auth],
        handler: (req, res) => {
            res.render('home');
        }
    }
};
