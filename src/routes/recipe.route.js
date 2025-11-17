import express from 'express';
import { recipeController } from '../controller/recipe.controller.js';
import { authGuard } from '../middlewares/guards.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createRecipeSchema,
  updateRecipeSchema,
} from '../validators/recipe.validator.js';

const router = express.Router();

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = recipeController;

router.post('/', authGuard, validate(createRecipeSchema), createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', authGuard, validate(updateRecipeSchema), updateRecipe);
router.delete('/:id', authGuard, deleteRecipe);

export default router;
