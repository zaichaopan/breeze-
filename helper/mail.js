const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

let fake = false;
let sentMails = [];

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(
        `${__dirname}/../views/email/${filename}.pug`,
        options
    );
    const inlined = juice(html);
    return inlined;
};

exports.send = async options => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };

    const sendMail = promisify(transport.sendMail, transport);

    if (fake) {
        sentMails = [...sentMails, mailOptions.to];
        fake = false;
        return;
    }

    return sendMail(mailOptions);
};

exports.hasSentTo = email => {
    return sentMails.includes(email);
};

exports.fake = () => {
    fake = true;
    sentMails = [];
};
