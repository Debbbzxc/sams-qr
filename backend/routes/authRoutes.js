import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 1. TEMPORARY SEED ROUTE: Run this once to create test users
router.post('/seed', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'instructor@sams.com' });
    if (existingAdmin) return res.status(400).json({ message: 'Test users already exist!' });

    // Create Test Instructor
    const instructor = new User({
      idNumber: 'INS-001',
      fullName: 'John Doe',
      email: 'instructor@sams.com',
      password: 'password123',
      role: 'Instructor'
    });

    // Create Test Student
    const student = new User({
      idNumber: 'STU-001',
      fullName: 'Jane Smith',
      email: 'student@sams.com',
      password: 'password123',
      role: 'Student'
    });

    await instructor.save();
    await student.save();

    res.status(201).json({ message: '✅ Test users created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  const { idNumber, fullName, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { idNumber }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this Email or ID Number already exists' });
    }

    // Create new user (Password hashing is handled automatically by our User model)
    const user = new User({
      idNumber,
      fullName,
      email,
      password,
      role
    });

    await user.save();

    res.status(201).json({ message: 'Registration successful! You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // 'identifier' can be Email OR ID Number

  try {
    // Find user by either Email or ID Number
    const user = await User.findOne({
      $or: [{ email: identifier }, { idNumber: identifier }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.fullName }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        idNumber: user.idNumber,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
