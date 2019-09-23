import Notification from '../schemas/Notification';
import User from '../models/User';
import * as Yup from 'yup';



class NotificationController {
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

        const notifications = await Notification
            .find({
                user: req.userId
            }).sort({ createdAt: 'desc' })
            .limit(20);
        return res.status(200).json(notifications);
    }
    async update(req, res) {

       

        const notification = await Notification.findByIdAndUpdate(req.params.id,
            { read: true },
            { new: true }
        );

        return res.status(200).json(notification);
    }

}
export default new NotificationController();