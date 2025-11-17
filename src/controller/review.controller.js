import db from '../config/database.js';
import { randomUUID } from 'crypto';
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from '../utils/errors.js';
import logger from '../config/logger.js';

export const reviewController = {
  createReview: async (req, res, next) => {
    try {
      const { recipeId, rating, comment } = req.body;
      const userId = req.user.userId;
      const recipe = await db('recipe').where({ id: recipeId }).first();
      if (!recipe) {
        throw new NotFoundError('Recipe not found');
      }
      const existingReview = await db('review')
        .where({ recipeId, userId })
        .first();
      if (existingReview) {
        throw new ValidationError('You already reviewed this recipe');
      }
      const reviewId = randomUUID();
      await db('review').insert({
        id: reviewId,
        recipeId,
        userId,
        rating,
        comment,
        status: 'pending',
      });
      const review = await db('review').where({ id: reviewId }).first();
      logger.info(`Review created for recipe: ${recipeId}`);
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        review,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllReviews: async (req, res, next) => {
    try {
      const { status, recipeId } = req.query;
      let query = db('review')
        .join('users', 'review.userId', 'users.id')
        .join('recipe', 'review.recipeId', 'recipe.id')
        .select('review.*', 'users.username', 'recipe.title as recipeTitle');
      if (status) {
        query = query.where('review.status', status);
      }
      if (recipeId) {
        query = query.where('review.recipeId', recipeId);
      }
      const reviews = await query;
      res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error) {
      next(error);
    }
  },

  getReviewById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const review = await db('review')
        .join('users', 'review.userId', 'users.id')
        .join('recipe', 'review.recipeId', 'recipe.id')
        .select('review.*', 'users.username', 'recipe.title as recipeTitle')
        .where('review.id', id)
        .first();
      if (!review) {
        throw new NotFoundError('Review not found');
      }
      res.status(200).json({
        success: true,
        review,
      });
    } catch (error) {
      next(error);
    }
  },

  updateReviewStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const review = await db('review').where({ id }).first();
      if (!review) {
        throw new NotFoundError('Review not found');
      }
      await db('review')
        .where({ id })
        .update({ status, updatedAt: db.fn.now() });
      const updatedReview = await db('review').where({ id }).first();
      logger.info(`Review status updated: ${id}`);
      res.status(200).json({
        success: true,
        message: 'Review status updated',
        review: updatedReview,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteReview: async (req, res, next) => {
    try {
      const { id } = req.params;
      const review = await db('review').where({ id }).first();
      if (!review) {
        throw new NotFoundError('Review not found');
      }
      if (review.userId !== req.user.userId && req.user.role !== 'admin') {
        throw new ForbiddenError('Access denied');
      }
      await db('review').where({ id }).delete();
      logger.info(`Review deleted: ${id}`);
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
