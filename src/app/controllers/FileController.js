import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import File from '../models/File';


class FileController {
    async store(req, res) {

        const { originalname: name, filename: path } = req.file;
        const file = await File.create({
            name,
            path
        });
        return res.status(200).json(file);
    }

}
export default new FileController();