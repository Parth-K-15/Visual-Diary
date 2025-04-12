import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import memoriesRouter from './routes/memories.js';
import authRouter from './routes/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased from default 100kb
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/memories', memoriesRouter);
app.use('/api/auth', authRouter); // Moved after middleware but before error handlers
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

export default app;