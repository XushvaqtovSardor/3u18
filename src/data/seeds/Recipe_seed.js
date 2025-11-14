import { randomUUID } from 'crypto';

export async function seed(knex) {
  await knex('recipe').del();

  const users = await knex('users').select('id').limit(2);

  await knex('recipe').insert([
    {
      id: randomUUID(),
      title: 'Classic Pancakes',
      description: 'Fluffy and delicious pancakes perfect for breakfast',
      category: 'Breakfast',
      cookingTime: 20,
      difficulty: 'easy',
      instructions:
        '1. Mix flour, sugar, and salt. 2. Add eggs and milk. 3. Cook on a hot griddle.',
      imageUrl: 'https://example.com/pancakes.jpg',
      authorId: users[0]?.id,
    },
    {
      id: randomUUID(),
      title: 'Chicken Alfredo Pasta',
      description: 'Creamy pasta with tender chicken',
      category: 'Main Course',
      cookingTime: 30,
      difficulty: 'medium',
      instructions:
        '1. Cook pasta. 2. Prepare chicken. 3. Make Alfredo sauce. 4. Combine all.',
      imageUrl: 'https://example.com/alfredo.jpg',
      authorId: users[1]?.id,
    },
    {
      id: randomUUID(),
      title: 'Vegetable Fried Rice',
      description: 'Healthy and tasty fried rice',
      category: 'Main Course',
      cookingTime: 25,
      difficulty: 'easy',
      instructions:
        '1. Cook rice. 2. Stir-fry vegetables. 3. Mix with rice and season.',
      imageUrl: 'https://example.com/friedrice.jpg',
      authorId: users[0]?.id,
    },
  ]);
}
