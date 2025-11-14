import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export const register = async (req, res) => {
  try {
    const { email, username, password, role = 'user' } = req.body;

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = randomUUID();
    await db('users').insert({
      id: userId,
      email,
      username,
      password: hashedPassword,
      role,
      status: 'active',
    });

    const user = await db('users').where({ id: userId }).first();
    const { password: _, ...userWithoutPassword } = user;

    res
      .status(201)
      .json({
        message: 'User registered successfully',
        user: userWithoutPassword,
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res
      .status(200)
      .json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db('users').select(
      'id',
      'email',
      'username',
      'role',
      'status',
      'createdAt'
    );

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db('users')
      .where({ id })
      .select('id', 'email', 'username', 'role', 'status', 'createdAt')
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await db('users').where({ id }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db('users')
      .where({ id })
      .update({ ...updates, updatedAt: db.fn.now() });

    const updatedUser = await db('users')
      .where({ id })
      .select(
        'id',
        'email',
        'username',
        'role',
        'status',
        'createdAt',
        'updatedAt'
      )
      .first();

    res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db('users').where({ id }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db('users').where({ id }).delete();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
