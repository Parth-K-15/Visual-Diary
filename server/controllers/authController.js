// const bcrypt = require('bcryptjs');
// const pool = require('../config/db');

// exports.register = async (req, res) => {
//     try {
//         console.log('Received registration data(authController.js):', req.body);
//         const { first_name, last_name, username, email, password } = req.body;
//         console.log('Extracted fields (authController.js):', { first_name, last_name, username, email });

//         // Check if user exists
//         const [existingUser] = await pool.query(
//             'SELECT * FROM users WHERE username = ? OR email = ?',
//             [username, email]
//         );

//         if (existingUser.length > 0) {
//             return res.status(400).json({
//                 message: 'Username or email already exists'
//             });
//         }
//         console.log('Checking for existing user... (authController.js)');

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         console.log('Password hashed, inserting user...(authController.js)');

//         // Insert new user
//         const [result] = await pool.query(
//             `INSERT INTO users 
//              (first_name, last_name, username, email, passwordd) 
//              VALUES (?, ?, ?, ?, ?)`,
//             [first_name, last_name, username, email, hashedPassword]
//         );

//         res.status(201).json({
//             message: 'User registered successfully',
//             userId: result.insertId
//         });
//         console.log('Insert result(authController.js):', result);

//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({
//             message: 'Server error during registration'
//         });
//     }
// };