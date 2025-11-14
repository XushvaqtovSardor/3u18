import express from 'express';
import {
  addIngredientToRecipe,
  getRecipeIngredients,
  updateRecipeIngredient,
  deleteRecipeIngredient,
} from '../controller/recipeIngredients.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, addIngredientToRecipe);
router.get('/:recipeId', getRecipeIngredients);
router.put('/:id', authenticate, updateRecipeIngredient);
router.delete('/:id', authenticate, deleteRecipeIngredient);

export default router;
