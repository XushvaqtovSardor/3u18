import db from '../config/database.js';
import { randomUUID } from 'crypto';

export const createRecipe = async (req, res) => {
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

    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllRecipes = async (req, res) => {
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

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await db('recipe')
      .leftJoin('users', 'recipe.authorId', 'users.id')
      .select('recipe.*', 'users.username as authorName')
      .where('recipe.id', id)
      .first();

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
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
      recipe: {
        ...recipe,
        ingredients,
        reviews,
        averageRating: avgRating?.averageRating || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const recipe = await db('recipe').where({ id }).first();
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db('recipe')
      .where({ id })
      .update({ ...updates, updatedAt: db.fn.now() });

    const updatedRecipe = await db('recipe').where({ id }).first();

    res
      .status(200)
      .json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await db('recipe').where({ id }).first();
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.authorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db('recipe').where({ id }).delete();

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
