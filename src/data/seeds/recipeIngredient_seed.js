import { v4 as uuidv4 } from "uuid";

export async function seed(knex) {
  await knex("recipeIngredient").del();

  const ingredients = await knex("ingredient").select("id");
  const recipes = await knex("recipe").select("id");

  await knex("recipeIngredient").insert([
    {
      id: uuidv4(),
      recipeId: recipes[0].id,
      ingredientId: ingredients[0].id,
      quantity: 200,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuidv4(),
      recipeId: recipes[0].id,
      ingredientId: ingredients[1].id,
      quantity: 5,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ]);
}

