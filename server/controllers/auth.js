import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        // Check if user exists
        const existingUser = await User.findByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.username === username
                    ? 'Username already exists'
                    : 'Email already exists'
            });
        }

        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'First name and last name are required' });
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
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // DEBUG: Log the user data from database
        console.log('User from DB:', {
            id: user.user_id,
            firstName: user.first_name, // Check if this exists
            lastName: user.last_name
        });

        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user.user_id,
            username: user.username,
            firstName: user.first_name || null, // Force include even if undefined
            lastName: user.last_name || null,
            email: user.email
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Login failed',
            error: error.message 
        });
    }
};