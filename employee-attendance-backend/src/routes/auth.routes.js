import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '7d',
  });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, employeeId, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || 'employee',
      employeeId,
      department,
    });

    const token = signToken(user._id);
    const userSafe = { ...user.toObject(), password: undefined };

    res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    const userSafe = { ...user.toObject(), password: undefined };

    res.json({ user: userSafe, token });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

export default router;
