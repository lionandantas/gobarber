import jwt from 'jsonwebtoken';
import User from '../models/User';
class SessionController {
    async store(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: {  email } });
        if (!user)
            res.status(401).json({ error: 'User not foud.' });

        if (!(await user.checkPassword(password))) {
            res.status(401).json({ error: 'Password does not match.' });
        }

        const { id, name } = user;

        return res.status(200).json({
            user: {
                id,
                name,
                email
            },
            token: jwt.sign(
                { id },
                '743ec03235ec7e91c16ad854be358c25',
                { expiresIn: '7d' }
            )
        });
    }

}
export default new SessionController();