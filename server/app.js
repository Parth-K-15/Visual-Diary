import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import memoriesRouter from './routes/memories.js';
import authRouter from './routes/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', memoriesRouter);
app.use('/api/auth', authRouter); // Moved after middleware but before error handlers

export default app;