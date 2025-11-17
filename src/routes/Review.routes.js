import express from 'express';
import { reviewController } from '../controller/Review.controller.js';
import { authGuard, roleGuard } from '../middlewares/guards.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createReviewSchema,
  updateReviewSchema,
} from '../validators/review.validator.js';

const router = express.Router();

const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
  updateData
} = reviewController;

router.post('/', authGuard, validate(createReviewSchema), createReview);
router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.put(
  '/:id/status',
  authGuard,
  roleGuard('admin'),
  validate(updateReviewSchema),
  updateReviewStatus
);
router.put('/:id',authGuard,updateData)
router.delete('/:id', authGuard, deleteReview);

export default router;
