import pool from '../config/db.js';

class Memory {
  static async getAllWithImages() {
    const [rows] = await pool.query(`
      SELECT 
        m.memory_id, m.title, m.memory_date,
        mi.image_data, mi.image_type, mi.caption
      FROM memories m
      LEFT JOIN memory_images mi ON m.memory_id = mi.memory_id
      WHERE mi.display_order = 0 OR mi.display_order IS NULL
      ORDER BY m.memory_date DESC
    `);
    return rows;
  }
}

export default Memory;