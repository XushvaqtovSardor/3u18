import db from '../config/database.js';
import { randomUUID } from 'crypto';

export const createIngredient = async (req, res) => {
  try {
    const { name, unit } = req.body;

    const existingIngredient = await db('ingredient').where({ name }).first();
    if (existingIngredient) {
      return res.status(400).json({ message: 'Ingredient already exists' });
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

    res
      .status(201)
      .json({ message: 'Ingredient created successfully', ingredient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await db('ingredient').select('*');

    res.status(200).json({ ingredients });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await db('ingredient').where({ id }).first();

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(200).json({ ingredient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ingredient = await db('ingredient').where({ id }).first();
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    await db('ingredient')
      .where({ id })
      .update({ ...updates, updatedAt: db.fn.now() });

    const updatedIngredient = await db('ingredient').where({ id }).first();

    res
      .status(200)
      .json({
        message: 'Ingredient updated successfully',
        ingredient: updatedIngredient,
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await db('ingredient').where({ id }).first();
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    await db('ingredient').where({ id }).delete();

    res.status(200).json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
