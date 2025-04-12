import pool from '../config/db.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/upload.js';

export const createMemory = async (req, res) => {
  try {
    const { title, date, isPrivate, previewImage, desiredFilename } = req.body;
    const userId = req.user.userId;

    if (!userId || !title || !date || !previewImage) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['title', 'date', 'previewImage']
      });
    }

    // Upload preview image to Cloudinary
    const { public_id, url } = await uploadToCloudinary(
      Buffer.from(previewImage, 'base64'),
      {
        folder: `users/${userId}/memories`,
        public_id: desiredFilename?.split('.')[0], // Remove extension if present
        filename_override: desiredFilename,
        unique_filename: false
      }
    );

    // Create memory in database
    const [result] = await pool.query(
      `INSERT INTO memories 
       (user_id, title, preview_image_url, cloudinary_preview_id, memory_date, is_private) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, url, public_id, date, isPrivate]
    );

    res.status(201).json({
      message: 'Memory created successfully',
      memoryId: result.insertId,
      previewImageUrl: url
    });
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({
      message: 'Error creating memory',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

export const addMemorySection = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { sectionNumber, description, caption } = req.body;
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: 'Section image is required' });
    }

    // Convert buffer to base64 for Cloudinary
    const imageBase64 = req.file.buffer.toString('base64');

    // Upload section image to Cloudinary
    const { public_id, url } = await uploadToCloudinary(
      `data:${req.file.mimetype};base64,${imageBase64}`,
      {
        folder: `users/${userId}/memories/${memoryId}/sections`,
        public_id: req.body.desiredFilename?.split('.')[0],
        filename_override: req.body.desiredFilename,
        unique_filename: false
      }
    );

    // Add section to database
    const [result] = await pool.query(
      `INSERT INTO memory_sections 
       (memory_id, section_number, image_url, cloudinary_image_id, description, caption) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [memoryId, sectionNumber, url, public_id, description, caption]
    );

    res.status(201).json({
      message: 'Section added successfully',
      sectionId: result.insertId,
      imageUrl: url
    });
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({
      message: 'Failed to add section',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

export const getMemories = async (req, res) => {
  try {
    const [memories] = await pool.query(
      `SELECT * FROM memories WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json(memories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch memories",
      error: error.message
    });
  }
};

export const getMemorySections = async (req, res) => {
  try {
    const { memoryId } = req.params;

    const [sections] = await pool.query(
      `SELECT * FROM memory_sections 
       WHERE memory_id = ? 
       ORDER BY section_number ASC`,
      [memoryId]
    );

    res.json(sections);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sections",
      error: error.message
    });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const userId = req.user.userId;

    // Get memory data first
    const [memory] = await pool.query(
      `SELECT cloudinary_preview_id FROM memories WHERE memory_id = ? AND user_id = ?`,
      [memoryId, userId]
    );

    if (!memory.length) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    // Get all sections to delete their images
    const [sections] = await pool.query(
      `SELECT cloudinary_image_id FROM memory_sections WHERE memory_id = ?`,
      [memoryId]
    );

    // Delete all section images from Cloudinary
    await Promise.all(
      sections.map(section =>
        deleteFromCloudinary(section.cloudinary_image_id)
          .catch(e => console.error(`Error deleting section image: ${e.message}`))
      )
    );

    // Delete preview image from Cloudinary
    await deleteFromCloudinary(memory[0].cloudinary_preview_id);

    // Delete from database
    await pool.query(`DELETE FROM memories WHERE memory_id = ?`, [memoryId]);

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({
      message: 'Error deleting memory',
      error: error.message
    });
  }
};