const jimp = require('jimp');
const uuid = require('uuid');
const multer = require('multer');
const asyncWrapper = require('../../helper/asyncWrapper');
const auth = require('../../middlewares/auth');

const multerOptions = {
    storage: multer.MemoryStorage,
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if (isPhoto) {
            return next(null, true);
        }

        next({ message: 'Please upload image!' }, false);
    }
};

const resize = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const extension = req.file.mimetype.split('/')[1];
    req.body.avatar = `${uuid.v4()}.${extension}`;
    const avatar = await jimp.read(req.file.buffer);
    await avatar.resize(800, jimp.AUTO);
    await avatar.write(`./public/uploads/avatars/${req.body.avatar}`);
    next();
};

module.exports = {
    store: {
        url: '/users/avatars',
        before: [auth, multer(multerOptions).single('avatar'), resize],
        handler: asyncWrapper(async (req, res, next) => {
            if (!req.body.avatar) {
                req.flash('error', 'Please provide a valid avatar!');
                return res.redirect('back');
            }

            await req.user.update({ avatar: req.body.avatar });
            res.redirect('back');
        })
    }
};
