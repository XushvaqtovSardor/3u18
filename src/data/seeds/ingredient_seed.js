import { v4 as uuidv4 } from "uuid";

export async function seed(knex) {
  await knex("ingredient").del();

  await knex("ingredient").insert([
    {
      id: uuidv4(),
      name: "Sugar",
      unit: "gram",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuidv4(),
      name: "Salt",
      unit: "gram",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuidv4(),
      name: "Milk",
      unit: "ml",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ]);
}
