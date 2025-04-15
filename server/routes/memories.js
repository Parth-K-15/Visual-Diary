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
  checkMemoryAccess,
  updateMemorySection,
  getMemorySections  // Add this import
} from '../controllers/memories.js';
import pool from '../config/db.js';

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
router.get('/user', authenticate, getUserMemories);
router.get('/user/:userId', authenticate, getUserMemories);
router.delete('/:memoryId', authenticate, deleteMemory);
router.post('/:memoryId/share', authenticate, shareMemory);
router.get('/shared', authenticate, getSharedMemories);

// Add these new routes
router.get('/:memoryId', authenticate, checkMemoryAccess, async (req, res) => {
  try {
    const [memory] = await pool.query(
      `SELECT m.*, u.username 
       FROM memories m
       JOIN users u ON m.user_id = u.user_id
       WHERE m.memory_id = ?`,
      [req.params.memoryId]
    );

    if (!memory.length) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json(memory[0]);
  } catch (error) {
    console.error('Error fetching memory:', error);
    res.status(500).json({
      message: 'Error fetching memory',
      error: error.message
    });
  }
});

router.get('/:memoryId/sections', authenticate, checkMemoryAccess, async (req, res) => {
  try {
    const [sections] = await pool.query(
      `SELECT * FROM memory_sections 
       WHERE memory_id = ? 
       ORDER BY section_number ASC`,
      [req.params.memoryId]
    );

    res.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      message: 'Error fetching sections',
      error: error.message
    });
  }
});

// Add this with your other routes
router.put(
  '/:memoryId/sections/:sectionId',
  authenticate,
  upload.single('sectionImage'),
  updateMemorySection
);

export default router;