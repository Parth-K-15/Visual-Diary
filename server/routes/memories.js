// server/routes/memories.js
import express from 'express';
import { authenticate } from '../middleware/auth.js'; // Using named import

const router = express.Router();

router.get('/', authenticate, (req, res) => {
    res.json({ 
        message: 'Protected route accessed successfully',
        user: req.user 
    });
});

export default router;