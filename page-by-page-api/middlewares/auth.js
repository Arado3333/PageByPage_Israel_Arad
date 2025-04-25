import jwt from 'jsonwebtoken';
import { ROLES } from '../global.js';

export async function isAdmin(req, res, next) {
    try {
        console.log('Checking admin status...');
        let token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Forbidden: No token provided' });
        } 
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        if (user && user.role === ROLES.ADMIN) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while checking admin status.' });
    }
}