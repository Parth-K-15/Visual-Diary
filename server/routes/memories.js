import express from 'express';
import { getMemoriesWithImages } from '../controllers/memories.js';

const router = express.Router();

router.get('/memories-with-images', getMemoriesWithImages);

export default router;