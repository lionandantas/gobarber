import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {

    constructor() {

        const { host, port, secure, auth } = mailConfig;
        this.transport = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null
        });
    }
    sendMail(message) {
        this.transport.sendMail({
            ...mailConfig.default,
            ...message
        });
    }
}

export default new Mail();
//https://mailtrap.io/inboxes/705956/settings