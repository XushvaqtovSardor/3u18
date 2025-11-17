import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { sendOTPEmail } from '../config/email.js';
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from '../utils/errors.js';
import logger from '../config/logger.js';

export const userController = {
  register: async (req, res, next) => {
    try {
      const { email, username, password, role = 'user' } = req.body;
      const existingUser = await db('users').where({ email }).first();
      if (existingUser) {
        throw new ValidationError('Email already registered');
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await db('otp').where({ email }).delete();
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = randomUUID();
      await db('users').insert({
        id: userId,
        email,
        username,
        password: hashedPassword,
        role,
        status: 'inactive',
      });
      await db('otp').insert({
        id: randomUUID(),
        email,
        otp,
        expiresAt,
        verified: false,
      });
      await sendOTPEmail(email, otp);
      logger.info(`User registered, OTP sent to ${email}`);
      res.status(201).json({
        success: true,
        message:
          'Registration successful. Please verify your email with OTP sent to your inbox',
        email,
      });
    } catch (error) {
      next(error);
    }
  },

  verifyOTP: async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const otpRecord = await db('otp')
        .where({ email, otp, verified: false })
        .first();
      if (!otpRecord) {
        throw new ValidationError('Invalid OTP');
      }
      if (new Date() > new Date(otpRecord.expiresAt)) {
        await db('otp').where({ id: otpRecord.id }).delete();
        throw new ValidationError('OTP expired');
      }
      await db('users').where({ email }).update({ status: 'active' });
      await db('otp').where({ id: otpRecord.id }).update({ verified: true });
      logger.info(`Email verified: ${email}`);
      res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now login',
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await db('users').where({ email }).first();
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials');
      }
      if (user.status === 'inactive') {
        throw new UnauthorizedError('Please verify your email first');
      }
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const { password: _, ...userWithoutPassword } = user;
      logger.info(`User logged in: ${email}`);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken,
        user: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token not found');
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await db('users').where({ id: decoded.userId }).first();
      if (!user) {
        throw new NotFoundError('User not found');
      }
      if (user.status === 'inactive') {
        throw new UnauthorizedError('Account is inactive');
      }
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      logger.info(`Token refreshed for user: ${user.email}`);
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
      });
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        next(new UnauthorizedError('Invalid or expired refresh token'));
      } else {
        next(error);
      }
    }
  },

  getMe: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const user = await db('users')
        .where({ id: userId })
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
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      logger.info(`User logged out: ${req.user?.email || 'Unknown'}`);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await db('users').select(
        'id',
        'email',
        'username',
        'role',
        'status',
        'createdAt'
      );
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await db('users')
        .where({ id })
        .select('id', 'email', 'username', 'role', 'status', 'createdAt')
        .first();
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await db('users').where({ id }).first();
      if (!user) {
        throw new NotFoundError('User not found');
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
      logger.info(`User updated: ${user.email}`);
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await db('users').where({ id }).first();
      if (!user) {
        throw new NotFoundError('User not found');
      }
      await db('users').where({ id }).delete();
      logger.info(`User deleted: ${user.email}`);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
