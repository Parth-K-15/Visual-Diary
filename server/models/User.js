import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ username, password, email, first_name, last_name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users 
       (username, passwordd, email, first_name, last_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, first_name, last_name]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }
}

export default User;