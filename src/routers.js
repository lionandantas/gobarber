import { Router } from 'express';
import User from './app/models/User';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routers = new Router();


routers.post('/users', UserController.store);
routers.post('/sessions', SessionController.store);

/*routers.get('/', async (req, res) => {
    return res.json({ ok: true });
});
*/

export default routers;