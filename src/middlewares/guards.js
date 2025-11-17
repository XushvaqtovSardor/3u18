import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import logger from '../config/logger.js';

export const authGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db('users')
      .where({ id: decoded.userId || decoded.id })
      .first();

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.status === 'inactive') {
      throw new ForbiddenError('Account is inactive');
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
      next(new UnauthorizedError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

export const roleGuard = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`User ${req.user.email} attempted unauthorized access`);
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

export const selfGuard = (req, res, next) => {
  const { id } = req.params;

  if (!req.user) {
    return next(new UnauthorizedError('Not authenticated'));
  }

  if (req.user.userId !== id && req.user.role !== 'admin') {
    logger.warn(
      `User ${req.user.email} attempted to access another user's data`
    );
    return next(new ForbiddenError('You can only access your own data'));
  }

  next();
};
