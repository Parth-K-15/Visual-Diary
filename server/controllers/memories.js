import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createMemory = async (req, res) => {
  try {
    const { title, date, isPrivate, filenameSafeTitle } = req.body;
    const userId = req.user.user_id;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

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
    console.error('Full error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create memory',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const addMemorySection = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { sectionNumber, description, caption, filenameSafeTitle } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Section image is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO memory_sections 
       (memory_id, section_number, description, caption) 
       VALUES (?, ?, ?, ?)`,
      [memoryId, sectionNumber, description, caption]
    );

    res.status(201).json({
      message: 'Section added successfully',
      sectionId: result.insertId
    });
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ 
      message: 'Failed to add section',
      error: error.message
    });
  }
};

export const getMemoriesWithImages = async (req, res) => {
  try {
    const [memories] = await pool.query(
      `SELECT m.*, 
       CONCAT('/DB-Images/preview_images/', m.filename_safe_title, '.jpg') as image_path
       FROM memories m
       WHERE m.user_id = ?`,
      [req.user.user_id]
    );

    res.json(memories);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch memories",
      error: error.message
    });
  }
};