import Joi from 'joi';

export const createReviewSchema = Joi.object({
  recipeId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow(''),
});

export const updateReviewSchema = Joi.object({
  status: Joi.string().valid('approved', 'pending', 'rejected').required(),
});
