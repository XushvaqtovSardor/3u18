import db from '../config/database.js';
import { randomUUID } from 'crypto';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '../utils/errors.js';
import logger from '../config/logger.js';

export const recipeController = {
  createRecipe: async (req, res, next) => {
    try {
      const {
        title,
        description,
        category,
        cookingTime,
        difficulty,
        instructions,
        imageUrl,
        ingredients,
      } = req.body;
      const authorId = req.user.userId;
      const recipeId = randomUUID();
      await db('recipe').insert({
        id: recipeId,
        title,
        description,
        category,
        cookingTime,
        difficulty,
        instructions,
        imageUrl,
        authorId,
      });
      for (const ing of ingredients) {
        await db('recipeIngredient').insert({
          id: randomUUID(),
          recipeId: recipeId,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit,
        });
      }
      const recipe = await db('recipe').where({ id: recipeId }).first();
      logger.info(`Recipe created: ${title}`);
      res.status(201).json({
        success: true,
        message: 'Recipe created successfully',
        recipe,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllRecipes: async (req, res, next) => {
    try {
      const { category, difficulty } = req.query;
      let query = db('recipe')
        .leftJoin('users', 'recipe.authorId', 'users.id')
        .select('recipe.*', 'users.username as authorName');
      if (category) {
        query = query.where('recipe.category', category);
      }
      if (difficulty) {
        query = query.where('recipe.difficulty', difficulty);
      }
      const recipes = await query;
      res.status(200).json({
        success: true,
        recipes,
      });
    } catch (error) {
      next(error);
    }
  },

  getRecipeById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const recipe = await db('recipe')
        .leftJoin('users', 'recipe.authorId', 'users.id')
        .select('recipe.*', 'users.username as authorName')
        .where('recipe.id', id)
        .first();
      if (!recipe) {
        throw new NotFoundError('Recipe not found');
      }
      const ingredients = await db('recipeIngredient')
        .join('ingredient', 'recipeIngredient.ingredientId', 'ingredient.id')
        .select(
          'ingredient.id',
          'ingredient.name',
          'recipeIngredient.quantity',
          'recipeIngredient.unit'
        )
        .where('recipeIngredient.recipeId', id);
      const reviews = await db('review')
        .join('users', 'review.userId', 'users.id')
        .select('review.*', 'users.username')
        .where('review.recipeId', id)
        .where('review.status', 'approved');
      const avgRating = await db('review')
        .where({ recipeId: id, status: 'approved' })
        .avg('rating as averageRating')
        .first();
      res.status(200).json({
        success: true,
        recipe: {
          ...recipe,
          ingredients,
          reviews,
          averageRating: avgRating?.averageRating || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  updateRecipe: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { ingredients, ...recipeUpdates } = req.body;
      const recipe = await db('recipe').where({ id }).first();
      if (!recipe) {
        throw new NotFoundError('Recipe not found');
      }
      if (recipe.authorId !== req.user.userId && req.user.role !== 'admin') {
        throw new ForbiddenError('Access denied');
      }
      if (Object.keys(recipeUpdates).length > 0) {
        await db('recipe')
          .where({ id })
          .update({ ...recipeUpdates, updatedAt: db.fn.now() });
      }
      if (ingredients && Array.isArray(ingredients)) {
        await db('recipeIngredient').where({ recipeId: id }).delete();
        for (const i of ingredients) {
          await db('recipeIngredient').insert({
            id: randomUUID(),
            recipeId: id,
            ingredientId: i.ingredientId,
            quantity: i.quantity,
            unit: i.unit,
          });
        }
      }
      const updatedRecipe = await db('recipe').where({ id }).first();
      const updatedIngredients = await db('recipeIngredient')
        .join('ingredient', 'recipeIngredient.ingredientId', 'ingredient.id')
        .select(
          'recipeIngredient.id as recipeIngredientId',
          'ingredient.id',
          'ingredient.name',
          'recipeIngredient.quantity',
          'recipeIngredient.unit'
        )
        .where('recipeIngredient.recipeId', id);
      logger.info(`Recipe updated: ${recipe.title}`);
      res.status(200).json({
        success: true,
        message: 'Recipe updated successfully',
        recipe: {
          ...updatedRecipe,
          ingredients: updatedIngredients,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteRecipe: async (req, res, next) => {
    try {
      const { id } = req.params;
      const recipe = await db('recipe').where({ id }).first();
      if (!recipe) {
        throw new NotFoundError('Recipe not found');
      }
      if (recipe.authorId !== req.user.userId && req.user.role !== 'admin') {
        throw new ForbiddenError('Access denied');
      }
      await db('recipe').where({ id }).delete();
      logger.info(`Recipe deleted: ${recipe.title}`);
      res.status(200).json({
        success: true,
        message: 'Recipe deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
