import { randomUUID } from 'crypto';

export async function seed(knex) {
  await knex('recipeIngredient').del();

  const recipes = await knex('recipe').select('id', 'title');
  const ingredients = await knex('ingredient').select('id', 'name', 'unit');

  const getIngredientByName = (name) =>
    ingredients.find((i) => i.name === name);
  const getRecipeByTitle = (title) => recipes.find((r) => r.title === title);

  const pancakesRecipe = getRecipeByTitle('Classic Pancakes');
  const alfredoRecipe = getRecipeByTitle('Chicken Alfredo Pasta');
  const friedRiceRecipe = getRecipeByTitle('Vegetable Fried Rice');

  const recipeIngredients = [];

  if (pancakesRecipe) {
    recipeIngredients.push(
      {
        id: randomUUID(),
        recipeId: pancakesRecipe.id,
        ingredientId: getIngredientByName('Flour')?.id,
        quantity: 0.5,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: pancakesRecipe.id,
        ingredientId: getIngredientByName('Sugar')?.id,
        quantity: 0.1,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: pancakesRecipe.id,
        ingredientId: getIngredientByName('Eggs')?.id,
        quantity: 2,
        unit: 'pcs',
      },
      {
        id: randomUUID(),
        recipeId: pancakesRecipe.id,
        ingredientId: getIngredientByName('Milk')?.id,
        quantity: 0.5,
        unit: 'liter',
      }
    );
  }

  if (alfredoRecipe) {
    recipeIngredients.push(
      {
        id: randomUUID(),
        recipeId: alfredoRecipe.id,
        ingredientId: getIngredientByName('Pasta')?.id,
        quantity: 0.5,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: alfredoRecipe.id,
        ingredientId: getIngredientByName('Chicken')?.id,
        quantity: 0.3,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: alfredoRecipe.id,
        ingredientId: getIngredientByName('Cheese')?.id,
        quantity: 0.2,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: alfredoRecipe.id,
        ingredientId: getIngredientByName('Butter')?.id,
        quantity: 0.1,
        unit: 'kg',
      }
    );
  }

  if (friedRiceRecipe) {
    recipeIngredients.push(
      {
        id: randomUUID(),
        recipeId: friedRiceRecipe.id,
        ingredientId: getIngredientByName('Rice')?.id,
        quantity: 0.5,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: friedRiceRecipe.id,
        ingredientId: getIngredientByName('Carrot')?.id,
        quantity: 0.2,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: friedRiceRecipe.id,
        ingredientId: getIngredientByName('Onion')?.id,
        quantity: 0.1,
        unit: 'kg',
      },
      {
        id: randomUUID(),
        recipeId: friedRiceRecipe.id,
        ingredientId: getIngredientByName('Garlic')?.id,
        quantity: 0.05,
        unit: 'kg',
      }
    );
  }

  await knex('recipeIngredient').insert(
    recipeIngredients.filter((ri) => ri.ingredientId)
  );
}
