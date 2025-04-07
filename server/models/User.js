import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ username, password, email, first_name, last_name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users 
       (username, password, email, first_name, last_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, first_name, last_name]
    );
    return result.insertId;
  }

  static async findByUsernameOrEmail(username, email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      // 'SELECT * FROM users WHERE email = ?',
      'SELECT user_id, username, email, first_name, last_name, password FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(userId) {
    const [rows] = await pool.query(
      'SELECT user_id, username, email FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }
}

export default User;