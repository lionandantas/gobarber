import express from 'express';
import routers from './routers';
import path from 'path'
import './database';

class App {

    constructor() {
        this.server = express();

        this.middlewares();
        this.routers();
    }

    middlewares() {
        this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));
        this.server.use(express.json());
    }

    routers() {
        this.server.use(routers);
    }
}

export default new App().server;