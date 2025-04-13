import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import {
  createMemory,
  addMemorySection,
  getMemories,
  getPublicMemories,
  getUserMemories,
  deleteMemory,
  shareMemory,
  getSharedMemories,
  checkMemoryAccess
} from '../controllers/memories.js';

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes
router.post('/', authenticate, upload.single('previewImage'), createMemory);
router.post('/:memoryId/sections', authenticate, upload.single('sectionImage'), addMemorySection);
router.get('/', authenticate, getMemories);
router.get('/public', getPublicMemories);

// Fix the optional parameter route - two separate routes instead of using ?
router.get('/user', authenticate, getUserMemories);
router.get('/user/:userId', authenticate, getUserMemories);
router.delete('/:memoryId', authenticate, deleteMemory);
router.post('/:memoryId/share', authenticate, shareMemory);

export default router;