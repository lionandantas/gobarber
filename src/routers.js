import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';



import authMiddleware from './app/middlewares/auth';

const routers = new Router();
const upload = multer(multerConfig);

routers.post('/users', UserController.store);
routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);

routers.put('/users', UserController.update);

routers.post('/files', upload.single('file'), FileController.store);
routers.get('/providers', ProviderController.index);


export default routers;