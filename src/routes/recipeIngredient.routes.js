import express from 'express';
import { recipeIngredientController } from '../controller/recipeIngredients.controller.js';
import { authGuard } from '../middlewares/guards.js';

const router = express.Router();

const {
  addIngredientToRecipe,
  getRecipeIngredients,
  updateRecipeIngredient,
  deleteRecipeIngredient,
} = recipeIngredientController;

router.post('/', authGuard, addIngredientToRecipe);
router.get('/:recipeId', getRecipeIngredients);
router.put('/:id', authGuard, updateRecipeIngredient);
router.delete('/:id', authGuard, deleteRecipeIngredient);

export default router;
