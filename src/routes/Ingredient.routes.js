import express from 'express';
import {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} from '../controller/ingredient.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createIngredientSchema,
  updateIngredientSchema,
} from '../validators/ingredient.validator.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createIngredientSchema),
  createIngredient
);
router.get('/', getAllIngredients);
router.get('/:id', getIngredientById);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateIngredientSchema),
  updateIngredient
);
router.delete('/:id', authenticate, authorize('admin'), deleteIngredient);

export default router;
