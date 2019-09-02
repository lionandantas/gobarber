import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routers = new Router();


routers.post('/users', UserController.store);
routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);
routers.put('/users', UserController.update);
/*routers.get('/', async (req, res) => {
    return res.json({ ok: true });
});
*/

export default routers;