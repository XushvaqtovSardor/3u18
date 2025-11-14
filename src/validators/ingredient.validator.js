import Joi from 'joi';

export const createIngredientSchema = Joi.object({
  name: Joi.string().required(),
  unit: Joi.string().required(),
});

export const updateIngredientSchema = Joi.object({
  name: Joi.string(),
  unit: Joi.string(),
});
