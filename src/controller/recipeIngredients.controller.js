import db from '../config/database.js';
import { randomUUID } from 'crypto';
import { ApiError } from '../utils/errors.js';
import logger from '../config/logger.js';

export const recipeIngredientController = {
  addIngredientToRecipe: async (req, res, next) => {
    try {
      const { recipeId, ingredientId, quantity, unit } = req.body;
      const recipe = await db('recipe').where({ id: recipeId }).first();
      if (!recipe) {
        throw new ApiError('Recipe not found', 404);
      }
      const ingredient = await db('ingredient')
        .where({ id: ingredientId })
        .first();
      if (!ingredient) {
        throw new ApiError('Ingredient not found', 404);
      }
      const recipeIngredientId = randomUUID();
      await db('recipeIngredient').insert({
        id: recipeIngredientId,
        recipeId,
        ingredientId,
        quantity,
        unit,
      });
      const recipeIngredient = await db('recipeIngredient')
        .where({ id: recipeIngredientId })
        .first();
      logger.info(`Ingredient added to recipe: ${recipeId}`);
      res.status(201).json({
        success: true,
        message: 'Ingredient added to recipe',
        recipeIngredient,
      });
    } catch (error) {
      next(error);
    }
  },

  getRecipeIngredients: async (req, res, next) => {
    try {
      const { recipeId } = req.params;
      const recipeIngredients = await db('recipeIngredient')
        .join('ingredient', 'recipeIngredient.ingredientId', 'ingredient.id')
        .select(
          'recipeIngredient.id',
          'recipeIngredient.recipeId',
          'ingredient.id as ingredientId',
          'ingredient.name',
          'recipeIngredient.quantity',
          'recipeIngredient.unit'
        )
        .where('recipeIngredient.recipeId', recipeId);
      res.status(200).json({
        success: true,
        recipeIngredients,
      });
    } catch (error) {
      next(error);
    }
  },

  updateRecipeIngredient: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { quantity, unit } = req.body;
      const recipeIngredient = await db('recipeIngredient')
        .where({ id })
        .first();
      if (!recipeIngredient) {
        throw new ApiError('Recipe ingredient not found', 404);
      }
      await db('recipeIngredient')
        .where({ id })
        .update({ quantity, unit, updatedAt: db.fn.now() });
      const updated = await db('recipeIngredient').where({ id }).first();
      logger.info(`Recipe ingredient updated: ${id}`);
      res.status(200).json({
        success: true,
        message: 'Recipe ingredient updated',
        recipeIngredient: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteRecipeIngredient: async (req, res, next) => {
    try {
      const { id } = req.params;
      const recipeIngredient = await db('recipeIngredient')
        .where({ id })
        .first();
      if (!recipeIngredient) {
        throw new ApiError('Recipe ingredient not found', 404);
      }
      await db('recipeIngredient').where({ id }).delete();
      logger.info(`Recipe ingredient deleted: ${id}`);
      res.status(200).json({
        success: true,
        message: 'Ingredient removed from recipe',
      });
    } catch (error) {
      next(error);
    }
  },
};
