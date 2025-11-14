import { v4 as uuidv4 } from "uuid";

export async function seed(knex) {
  await knex("recipe").del();

  await knex("recipe").insert([
    {
      id: uuidv4(),
      title: "Pancakes",
      description: "Soft breakfast pancakes",
      category: "Breakfast",
      cookingTime: 15,
      difficulty: "easy",
      instructions: "Mix ingredients and cook on pan.",
      imageUrl: null,
      authorId: null,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuidv4(),
      title: "Spaghetti",
      description: "Italian pasta with sauce",
      category: "Dinner",
      cookingTime: 25,
      difficulty: "medium",
      instructions: "Boil pasta and prepare sauce.",
      imageUrl: null,
      authorId: null,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ]);
}
