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

// In your memories controller
export const getMemories = async (req, res) => {
  try {
    console.log('Fetching memories for user:', req.user.userId);

    const [memories] = await pool.query(
      `SELECT 
        m.*,
        u.username,
        u.profile_picture_url
       FROM memories m
       JOIN users u ON m.user_id = u.user_id
       WHERE m.user_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.userId]
    );

    console.log('Memories found:', memories);

    // Format dates
    const formattedMemories = memories.map(memory => ({
      ...memory,
      formattedDate: new Date(memory.memory_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));

    res.json(formattedMemories);
  } catch (error) {
    console.error('Error in getMemories:', error);
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

// Add this to your existing exports in memories.js
export const getPublicMemories = async (req, res) => {
  try {
    // Get public memories or private memories for the authenticated user
    const [memories] = await pool.query(
      `SELECT 
        m.memory_id,
        m.title,
        m.preview_image_url,
        m.memory_date,
        m.created_at,
        u.username,
        u.profile_picture_url
       FROM memories m
       JOIN users u ON m.user_id = u.user_id
       WHERE m.is_private = FALSE OR m.user_id = ?
       ORDER BY m.created_at DESC`,
      [req.user?.userId || null]
    );

    // Format the date as "DD MMM YYYY" (e.g., "13 Apr 2025")
    const formattedMemories = memories.map(memory => ({
      ...memory,
      formattedDate: new Date(memory.memory_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));

    res.json(formattedMemories);
  } catch (error) {
    console.error('Error fetching public memories:', error);
    res.status(500).json({
      message: 'Failed to fetch public memories',
      error: error.message
    });
  }
};


export const getUserMemories = async (req, res) => {
  try {
    // Use req.params.userId if it exists, otherwise use req.user.userId
    const userId = req.params.userId || req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const [memories] = await pool.query(
      `SELECT 
        m.memory_id,
        m.title,
        m.preview_image_url,
        m.memory_date,
        m.created_at,
        u.username,
        u.profile_picture_url
       FROM memories m
       JOIN users u ON m.user_id = u.user_id
       WHERE m.user_id = ?
       ORDER BY m.created_at DESC`,
      [userId]
    );

    const formattedMemories = memories.map(memory => ({
      ...memory,
      formattedDate: new Date(memory.memory_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));

    res.json(formattedMemories);
  } catch (error) {
    console.error('Error fetching user memories:', error);
    res.status(500).json({
      message: 'Failed to fetch user memories',
      error: error.message
    });
  }
};

// Add these exports at the bottom with other exports

export const shareMemory = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { email, canEdit } = req.body;
    const userId = req.user.userId;

    // Verify memory exists and belongs to user
    const [memory] = await pool.query(
      `SELECT user_id FROM memories WHERE memory_id = ?`,
      [memoryId]
    );

    if (!memory.length || memory[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to share this memory' });
    }

    // Find user being shared with
    const [user] = await pool.query(
      `SELECT user_id FROM users WHERE email = ?`,
      [email]
    );

    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create share record
    await pool.query(
      `INSERT INTO memory_shares 
       (memory_id, owner_id, shared_with_id, can_edit) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE can_edit = VALUES(can_edit)`,
      [memoryId, userId, user[0].user_id, canEdit]
    );

    res.status(200).json({ message: 'Memory shared successfully' });
  } catch (error) {
    console.error('Error sharing memory:', error);
    res.status(500).json({ message: 'Error sharing memory', error: error.message });
  }
};

export const getSharedMemories = async (req, res) => {
  try {
    // Use proper variable names - don't destructure the query result immediately
    const [sharedMemories] = await pool.query(
      `SELECT 
        m.*, 
        u.username as owner_username,
        ms.can_edit
       FROM memory_shares ms
       JOIN memories m ON ms.memory_id = m.memory_id
       JOIN users u ON ms.owner_id = u.user_id
       WHERE ms.shared_with_id = ?
       ORDER BY ms.shared_at DESC`,
      [req.user.userId]
    );

    // Format the response properly
    const formattedMemories = sharedMemories.map(memory => ({
      ...memory,
      formattedDate: new Date(memory.memory_date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    }));

    res.json({
      memories: formattedMemories,
      permissions: sharedMemories.reduce((acc, memory) => {
        acc[memory.memory_id] = { canEdit: memory.can_edit };
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching shared memories:', error);
    res.status(500).json({ 
      message: 'Failed to fetch shared memories', 
      error: error.message 
    });
  }
};

export const checkMemoryAccess = async (req, res, next) => {
  try {
    const { memoryId } = req.params;
    const userId = req.user.userId;

    // Check ownership
    const [owned] = await pool.query(
      `SELECT 1 FROM memories WHERE memory_id = ? AND user_id = ?`,
      [memoryId, userId]
    );

    if (owned.length) return next();

    // Check sharing
    const [shared] = await pool.query(
      `SELECT can_edit FROM memory_shares 
       WHERE memory_id = ? AND shared_with_id = ?`,
      [memoryId, userId]
    );

    if (!shared.length) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.canEdit = shared[0].can_edit;
    next();
  } catch (error) {
    console.error('Error checking access:', error);
    res.status(500).json({ message: 'Error verifying access', error: error.message });
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

export const updateMemorySection = async (req, res) => {
  try {
    const { memoryId, sectionId } = req.params;
    const { sectionNumber, description, caption } = req.body;
    const userId = req.user.userId;

    // Verify memory belongs to user
    const [memory] = await pool.query(
      `SELECT user_id FROM memories WHERE memory_id = ?`,
      [memoryId]
    );

    if (!memory.length || memory[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this memory' });
    }

    let updateData = {
      description,
      caption,
      section_number: sectionNumber
    };

    // Handle image upload if provided
    if (req.file) {
      const imageBase64 = req.file.buffer.toString('base64');
      const { public_id, url } = await uploadToCloudinary(
        `data:${req.file.mimetype};base64,${imageBase64}`,
        {
          folder: `users/${userId}/memories/${memoryId}/sections`,
          public_id: req.body.desiredFilename?.split('.')[0],
          filename_override: req.body.desiredFilename,
          unique_filename: false
        }
      );

      updateData.image_url = url;
      updateData.cloudinary_image_id = public_id;
    }

    // Update section in database
    await pool.query(
      `UPDATE memory_sections SET 
        section_number = ?,
        ${req.file ? 'image_url = ?, cloudinary_image_id = ?,' : ''}
        description = ?,
        caption = ?
       WHERE section_id = ? AND memory_id = ?`,
      [
        updateData.section_number,
        ...(req.file ? [updateData.image_url, updateData.cloudinary_image_id] : []),
        updateData.description,
        updateData.caption,
        sectionId,
        memoryId
      ]
    );

    res.status(200).json({
      message: 'Section updated successfully',
      ...(req.file && { imageUrl: updateData.image_url })
    });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({
      message: 'Failed to update section',
      error: error.message
    });
  }
};