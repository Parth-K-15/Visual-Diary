// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Received token:', token);
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Set the userId directly on req.user
        req.user = { userId: decoded.userId };  // Changed from full user object
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Add this if you want to support both named and default exports
export default authenticate;