import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const userId = await User.create({
      username,
      password,
      email,
      first_name: firstName,
      last_name: lastName
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      userId 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
};