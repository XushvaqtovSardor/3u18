import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
} from '../controller/review.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createReviewSchema,
  updateReviewSchema,
} from '../validators/review.validator.js';

const router = express.Router();

router.post('/', authenticate, validate(createReviewSchema), createReview);
router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.put(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validate(updateReviewSchema),
  updateReviewStatus
);
router.delete('/:id', authenticate, deleteReview);

export default router;
