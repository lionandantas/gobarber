import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';


class AppointmentController {
    async store(req, res) {

        
        return res.status(200).json({ok:true});
    }

}
export default new AppointmentController();