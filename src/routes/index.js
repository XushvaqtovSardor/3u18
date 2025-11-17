import express from 'express';
import userRoutes from './user.routes.js';
import ingredientRoutes from './Ingredient.routes.js';
import recipeRoutes from './recipe.route.js';
import recipeIngredientRoutes from './recipeIngredient.routes.js';
import reviewRoutes from './Review.routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/recipes', recipeRoutes);
router.use('/recipeIngredients', recipeIngredientRoutes);
router.use('/reviews', reviewRoutes);

export default router;
