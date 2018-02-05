const jimp = require('jimp');
const uuid = require('uuid');
const multer = require('multer');
const asyncWrapper = require('../../helper/asyncWrapper');

const multerOptions = {
    storage: multer.memoryStorage,
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
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

module.exports = {
    store: {
        url: '/users/:userId/avatars',
        before: [auth, multer(multerOptions).single('photo'), resize],
        handler: asyncWrapper(async (req, res, next) => {
            await req.user.update({ photo: req.photo });
            res.direct('back');
        })
    }
};
