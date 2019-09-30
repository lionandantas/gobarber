import express from 'express';
import 'express-async-errors';
import routers from './routers';
import path from 'path'
import * as Sentry from '@sentry/node';
import sentryConf from './config/sentry';
import './database';
import Youch from 'youch';


class App {

    constructor() {
        this.server = express();
        Sentry.init(sentryConf);
        this.middlewares();
        this.routers();
        this.execptionHandler();
    }

    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));
        this.server.use(express.json());
    }

    routers() {
        this.server.use(routers);
        this.server.use(Sentry.Handlers.errorHandler());
    }
    execptionHandler() {
        this.server.use(async (err, req, res, next) => {
            const erros = await new Youch(err,req).toJSON();

            return res.status(500).json(erros);
        });
    }
}

export default new App().server;