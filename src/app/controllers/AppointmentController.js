import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import File from '../models/File';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';
import Mail from '../../lib/mail';


class AppointmentController {

    async index(req, res) {
        const { page } = req.query;

        const appointments = await Appointment.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,

            },
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [{
                model: User,
                as: 'provider',
                attributes: ['id', 'name'],
                include: [{
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'url', 'path'],
                }]
            }]
        });
        return res.status(200).json(appointments);
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


        if (provider_id == req.userId) {
            return res.status(401).json({ error: 'Select in u.' });
        }

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

        /**
         * Notify  appointment Provider
         */

        const formatteDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm,'h' ", { locale: pt });

        const user = await User.findByPk(req.userId);
        var teste = await Notification.create({
            content: `Novo agendamento  de ${user.name} para o ${formatteDate} `,
            user: provider_id
        });

        return res.status(200).json(appointment);
    }
    async delete(req, res) {

        const appointment = await Appointment.findByPk(req.params.id, {

            include: [{
                model: User,
                as: 'provider',
                attributes: ['name', 'email']
            }]
        });
        if (appointment.user_id !== req.userId) {
            return res.status(401).json({ error: "You don't have permission to cancel this appointment." });
        }

        const dateWithSub = subHours(appointment.date, 2);


        if (isBefore(dateWithSub, new Date())) {
            return res.status(401).json({ error: "You can only cancel appointments 2 hours in advance." });
        }
        appointment.canceled_at = new Date();

        await appointment.save();
        console.log(JSON.stringify(appointment));
        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            text: 'Voce tem um novo cancelmaneto'
        });

        return res.status(200).json(appointment);
    }

}
export default new AppointmentController();