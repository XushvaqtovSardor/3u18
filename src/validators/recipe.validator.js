import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  category: Joi.string().required(),
  cookingTime: Joi.number().integer().min(1).required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  instructions: Joi.string().required(),
  imageUrl: Joi.string().uri().allow(''),
  ingredients: Joi.array()
    .items(
      Joi.object({
        ingredientId: Joi.string().uuid().required(),
        quantity: Joi.number().positive().required(),
        unit: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
});

export const updateRecipeSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(''),
  category: Joi.string(),
  cookingTime: Joi.number().integer().min(1),
  difficulty: Joi.string().valid('easy', 'medium', 'hard'),
  instructions: Joi.string(),
  imageUrl: Joi.string().uri().allow(''),
});
