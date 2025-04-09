// server/routes/memories.js
// import express from 'express';
// import { authenticate } from '../middleware/auth.js'; // Using named import

// const router = express.Router();

// router.get('/', authenticate, (req, res) => {
//     res.json({ 
//         message: 'Protected route accessed successfully',
//         user: req.user 
//     });
// });

// export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Path to your public images directory
    const uploadPath = path.join(__dirname, '../../client/public/DB-Images/preview_images');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Use the filename_safe_title from the request body
    const filenameSafeTitle = req.body.filenameSafeTitle;
    const sectionNumber = req.body.sectionNumber;
    const ext = path.extname(file.originalname);
    cb(null, `${filenameSafeTitle}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create a new memory
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, filenameSafeTitle, date, isPrivate } = req.body;
    const userId = req.user.user_id;
    const imagePath = `/DB-Images/preview_images/${filenameSafeTitle}${path.extname(req.file.originalname)}`;

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO memories 
       (user_id, title, filename_safe_title, memory_date, is_private) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, filenameSafeTitle, date, isPrivate === 'true']
    );

    res.status(201).json({
      message: 'Memory created successfully',
      memoryId: result.insertId,
      imagePath
    });
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ 
      message: 'Failed to create memory',
      error: error.message 
    });
  }
});

export default router;