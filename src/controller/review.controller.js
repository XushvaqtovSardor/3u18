import db from '../config/database.js';
import { randomUUID } from 'crypto';

export const createReview = async (req, res) => {
  try {
    const { recipeId, rating, comment } = req.body;
    const userId = req.user.userId;

    const recipe = await db('recipe').where({ id: recipeId }).first();
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const existingReview = await db('review')
      .where({ recipeId, userId })
      .first();
    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You already reviewed this recipe' });
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

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
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

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await db('review')
      .join('users', 'review.userId', 'users.id')
      .join('recipe', 'review.recipeId', 'recipe.id')
      .select('review.*', 'users.username', 'recipe.title as recipeTitle')
      .where('review.id', id)
      .first();

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await db('review').where({ id }).first();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await db('review').where({ id }).update({ status, updatedAt: db.fn.now() });

    const updatedReview = await db('review').where({ id }).first();

    res
      .status(200)
      .json({ message: 'Review status updated', review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await db('review').where({ id }).first();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db('review').where({ id }).delete();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
