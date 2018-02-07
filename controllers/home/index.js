const auth = require('../../middlewares/auth');

module.exports = {
    index: {
        url: '/home',
        before: [auth],
        handler: (req, res) => {
            console.log('in home');
            res.render('home');
        }
    }
};
