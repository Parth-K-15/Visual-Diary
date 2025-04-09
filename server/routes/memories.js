import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/db.js';
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure storage for preview images
const previewStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../client/public/DB-Images/preview_images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filenameSafeTitle = req.body.filenameSafeTitle;
    const ext = path.extname(file.originalname);
    cb(null, `${filenameSafeTitle}${ext}`);
  }
});

// Configure storage for section images
const sectionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../client/public/DB-Images/section_images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filenameSafeTitle = req.body.filenameSafeTitle;
    const sectionNumber = req.body.sectionNumber;
    const ext = path.extname(file.originalname);
    cb(null, `${filenameSafeTitle}(section ${sectionNumber})${ext}`);
  }
});

const uploadPreview = multer({ 
  storage: previewStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const uploadSection = multer({ 
  storage: sectionStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create a new memory
router.post('/', authenticate, uploadPreview.single('image'), async (req, res) => {
  try {
    const { title, filenameSafeTitle, date, isPrivate } = req.body;
    const userId = req.user.user_id;
    const imagePath = `/DB-Images/preview_images/${filenameSafeTitle}${path.extname(req.file.originalname)}`;

    const [result] = await pool.query(
      `INSERT INTO memories 
       (user_id, title, filename_safe_title, memory_date, is_private) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, filenameSafeTitle, date, isPrivate === 'true']
    );

    res.status(201).json({
      message: 'Memory created successfully',
      memoryId: result.insertId,
      filenameSafeTitle
    });
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ 
      message: 'Failed to create memory',
      error: error.message 
    });
  }
});

// Add section to memory
router.post('/:memoryId/sections', authenticate, uploadSection.single('image'), async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { sectionNumber, description, caption, filenameSafeTitle } = req.body;
    const imagePath = `/DB-Images/section_images/${filenameSafeTitle}(section ${sectionNumber})${path.extname(req.file.originalname)}`;

    const [result] = await pool.query(
      `INSERT INTO memory_sections 
       (memory_id, section_number, description, caption) 
       VALUES (?, ?, ?, ?)`,
      [memoryId, sectionNumber, description, caption]
    );

    res.status(201).json({
      message: 'Section added successfully',
      sectionId: result.insertId,
      imagePath
    });
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ 
      message: 'Failed to add section',
      error: error.message 
    });
  }
});

export default router;