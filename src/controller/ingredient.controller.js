import db from '../config/database.js';
import { randomUUID } from 'crypto';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

export const ingredientController = {
  createIngredient: async (req, res, next) => {
    try {
      const { name, unit } = req.body;
      const existingIngredient = await db('ingredient').where({ name }).first();
      if (existingIngredient) {
        throw new ValidationError('Ingredient already exists');
      }
      const ingredientId = randomUUID();
      await db('ingredient').insert({
        id: ingredientId,
        name,
        unit,
      });
      const ingredient = await db('ingredient')
        .where({ id: ingredientId })
        .first();
      logger.info(`Ingredient created: ${name}`);
      res.status(201).json({
        success: true,
        message: 'Ingredient created successfully',
        ingredient,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllIngredients: async (req, res, next) => {
    try {
      const ingredients = await db('ingredient').select('*');
      res.status(200).json({
        success: true,
        ingredients,
      });
    } catch (error) {
      next(error);
    }
  },

  getIngredientById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ingredient = await db('ingredient').where({ id }).first();
      if (!ingredient) {
        throw new NotFoundError('Ingredient not found');
      }
      res.status(200).json({
        success: true,
        ingredient,
      });
    } catch (error) {
      next(error);
    }
  },

  updateIngredient: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const ingredient = await db('ingredient').where({ id }).first();
      if (!ingredient) {
        throw new NotFoundError('Ingredient not found');
      }
      await db('ingredient')
        .where({ id })
        .update({ ...updates, updatedAt: db.fn.now() });
      const updatedIngredient = await db('ingredient').where({ id }).first();
      logger.info(`Ingredient updated: ${ingredient.name}`);
      res.status(200).json({
        success: true,
        message: 'Ingredient updated successfully',
        ingredient: updatedIngredient,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteIngredient: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ingredient = await db('ingredient').where({ id }).first();
      if (!ingredient) {
        throw new NotFoundError('Ingredient not found');
      }
      await db('ingredient').where({ id }).delete();
      logger.info(`Ingredient deleted: ${ingredient.name}`);
      res.status(200).json({
        success: true,
        message: 'Ingredient deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
