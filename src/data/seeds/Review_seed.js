import { v4 as uuidv4 } from "uuid";

export async function seed(knex) {
  await knex("review").del();

  const recipes = await knex("recipe").select("id");
  const users = await knex("users").select("id");

  await knex("review").insert([
    {
      id: uuidv4(),
      recipeId: recipes[0].id,
      userId: users[1].id,
      rating: 5,
      comment: "Very tasty!",
      status: "approved",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuidv4(),
      recipeId: recipes[1].id,
      userId: users[2].id,
      rating: 4,
      comment: "Nice recipe!",
      status: "approved",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ]);
}

