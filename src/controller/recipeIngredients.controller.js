import db from '../config/database.js';
import { randomUUID } from 'crypto';

export const addIngredientToRecipe = async (req, res) => {
  try {
    const { recipeId, ingredientId, quantity, unit } = req.body;

    const recipe = await db('recipe').where({ id: recipeId }).first();
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const ingredient = await db('ingredient')
      .where({ id: ingredientId })
      .first();
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
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

    res
      .status(201)
      .json({ message: 'Ingredient added to recipe', recipeIngredient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRecipeIngredients = async (req, res) => {
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

    res.status(200).json({ recipeIngredients });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRecipeIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unit } = req.body;

    const recipeIngredient = await db('recipeIngredient').where({ id }).first();
    if (!recipeIngredient) {
      return res.status(404).json({ message: 'Recipe ingredient not found' });
    }

    await db('recipeIngredient')
      .where({ id })
      .update({ quantity, unit, updatedAt: db.fn.now() });

    const updated = await db('recipeIngredient').where({ id }).first();

    res
      .status(200)
      .json({
        message: 'Recipe ingredient updated',
        recipeIngredient: updated,
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteRecipeIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const recipeIngredient = await db('recipeIngredient').where({ id }).first();
    if (!recipeIngredient) {
      return res.status(404).json({ message: 'Recipe ingredient not found' });
    }

    await db('recipeIngredient').where({ id }).delete();

    res.status(200).json({ message: 'Ingredient removed from recipe' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
