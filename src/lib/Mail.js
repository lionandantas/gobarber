import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';
import exphbs from 'express-handlebars';
import { resolve } from 'path';
import nodemailerhbs from 'nodemailer-express-handlebars';

class Mail {

    constructor() {

        const { host, port, secure, auth } = mailConfig;
        this.transport = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null
        });

        this.configureTemplates();
    }
    configureTemplates() {
        const viewPath = resolve(__dirname, '..', 'app', 'views','emails');
        this.transport.use('compile', nodemailerhbs({
            viewEngine: exphbs.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default',
                extname: '.hbs'
            }),
            viewPath,
            extName: '.hbs'

        }));
    }
    async sendMail(message) {
        console.log(" EMAIL"+ JSON.stringify(message));
       const result = await this.transport.sendMail({
            ...mailConfig.default,
            ...message
        });

        console.log("ERRO EMAIL"+ JSON.stringify(result));
    }
}

export default new Mail();
//https://mailtrap.io/inboxes/705956/settings