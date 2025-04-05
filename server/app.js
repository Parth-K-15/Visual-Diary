import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import memoriesRouter from './routes/memories.js';
import authRouter from './routes/auth.js';

// Add this with other middleware
app.use('/api/auth', authRouter);
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', memoriesRouter);

export default app;