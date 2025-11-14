import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const UserController = {
  register: async (req, res) => {
    try {
      const { email, username, password, role } = req.body;
      if (!email || !username || !password) return res.status(400).json({ message: 'All fields are required' });
      const existing = await req.knex('users').where({ email }).first();
      if (existing) return res.status(400).json({ message: 'Email already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: uuidv4(), email, username, password: hashedPassword, role: role || 'user', status: 'active' };
      await req.knex('users').insert(newUser);
      res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email, username, role: newUser.role } });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email & password required' });
      const user = await req.knex('users').where({ email }).first();
      if (!user) return res.status(404).json({ message: 'User not found' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Incorrect password' });
      const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
      res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
      return res.json({ message: 'Login successful', accessToken, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const token = req.cookies.refresh_token;
      if (!token) return res.status(401).json({ message: 'Refresh token missing' });
      jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });
        const accessToken = jwt.sign({ id: decoded.id }, ACCESS_SECRET, { expiresIn: '15m' });
        return res.json({ accessToken });
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  logout: async (req, res) => {
    res.clearCookie('refresh_token');
    res.json({ message: 'Logged out successfully' });
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, username, password, role, status } = req.body;
      const updateData = {};
      if (email) updateData.email = email;
      if (username) updateData.username = username;
      if (role) updateData.role = role;
      if (status) updateData.status = status;
      if (password) updateData.password = await bcrypt.hash(password, 10);
      const updated = await req.knex('users').where({ id }).update(updateData);
      if (!updated) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await req.knex('users').where({ id }).del();
      if (!deleted) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },
};
