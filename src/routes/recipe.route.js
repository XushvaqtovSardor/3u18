import express from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controller/recipe.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createRecipeSchema,
  updateRecipeSchema,
} from '../validators/recipe.validator.js';

const router = express.Router();

router.post('/', authenticate, validate(createRecipeSchema), createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', authenticate, validate(updateRecipeSchema), updateRecipe);
router.delete('/:id', authenticate, deleteRecipe);

export default router;
