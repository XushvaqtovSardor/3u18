import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { ApiError } from '../utils/errors.js';
import logger from '../config/logger.js';

export const authGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError('No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db('users')
      .where({ id: decoded.userId || decoded.id })
      .first();

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (user.status === 'inactive') {
      throw new ApiError('Account is inactive', 401);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    logger.info(`User ${user.email} authenticated`);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const roleGuard = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`User ${req.user.email} surov yubordi`);
      return next(new ApiError('Access denied', 403));
    }

    next();
  };
};

export const selfGuard = (req, res, next) => {
  const { id } = req.params;

  if (!req.user) {
    return next(new ApiError('Not authenticated', 401));
  }

  if (req.user.userId !== id && req.user.role !== 'admin') {
    logger.warn(`User ${req.user.email} not allowed`);
    return next(new ApiError('Forbidden', 403));
  }

  next();
};
