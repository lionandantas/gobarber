import User from '../models/User';
import Appointment from '../models/Appointment';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';


class AppointmentController {

    async index(req, res) {
        return res.status(200).json({ ok: true });
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            date: Yup.date().required(),
            provider_id: Yup.number().required()
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { provider_id, date } = req.body;

        /**
         * Check if provider_id  provider is a provider 
         */
        const isProvider = await User.findOne({ where: { id: provider_id, provider: true } });

        if (!isProvider) {
            return res.status(401).json({ error: 'How can only create appointments with providers.' });
        }


        /**
         * Check for past dates
         */
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res.status(400).json({ error: 'Paste  dates are not permitted.' });
        }
        /**
         * Check for availability
         */

        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart
            }
        });

        if (checkAvailability) {
            return res.status(400).json({ error: 'Appointment is not available.' });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date
        });

        return res.status(200).json(appointment);
    }

}
export default new AppointmentController();