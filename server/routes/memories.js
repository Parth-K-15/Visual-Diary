import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import {
  createMemory,
  addMemorySection,
  getMemories
} from '../controllers/memories.js';

const router = express.Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create a new memory
router.post('/', authenticate, upload.single('previewImage'), createMemory);

// Add this route to your existing memory routes
router.post('/:memoryId/sections', authenticate, upload.single('sectionImage'), addMemorySection);

// Get all memories for user
router.get('/', authenticate, getMemories);

export default router;