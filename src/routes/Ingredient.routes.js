import express from 'express';
import { ingredientController } from '../controller/ingredient.controller.js';
import { authGuard, roleGuard } from '../middlewares/guards.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createIngredientSchema,
  updateIngredientSchema,
} from '../validators/ingredient.validator.js';

const router = express.Router();

const {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} = ingredientController;

router.post(
  '/',
  authGuard,
  roleGuard('admin'),
  validate(createIngredientSchema),
  createIngredient
);
router.get('/', getAllIngredients);
router.get('/:id', getIngredientById);
router.put(
  '/:id',
  authGuard,
  roleGuard('admin'),
  validate(updateIngredientSchema),
  updateIngredient
);
router.delete('/:id', authGuard, roleGuard('admin'), deleteIngredient);

export default router;
