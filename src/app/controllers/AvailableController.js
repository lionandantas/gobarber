import User from '../models/User';
import Appointment from '../models/Appointment';
import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';


class AvailableController {

    async index(req, res) {


        const checkUserProvider = await User.findOne({
            where: {
                id: req.userId,
                provider: true
            }
        });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider.' });
        }

        const { date } = req.query;

        const parseDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)]
                }

            },
            order: ['date']

        });

        return res.status(200).json(appointments);
    }
}




export default new AvailableController();