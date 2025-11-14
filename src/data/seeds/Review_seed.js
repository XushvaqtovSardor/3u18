import { randomUUID } from 'crypto';

export async function seed(knex) {
  await knex('review').del();

  const recipes = await knex('recipe').select('id');
  const users = await knex('users').where({ role: 'user' }).select('id');

  if (recipes.length === 0 || users.length === 0) return;

  await knex('review').insert([
    {
      id: randomUUID(),
      recipeId: recipes[0]?.id,
      userId: users[0]?.id,
      rating: 5,
      comment: 'Absolutely delicious! My family loved it.',
      status: 'approved',
    },
    {
      id: randomUUID(),
      recipeId: recipes[1]?.id,
      userId: users[0]?.id,
      rating: 4,
      comment: 'Very good, but could use more seasoning.',
      status: 'approved',
    },
    {
      id: randomUUID(),
      recipeId: recipes[0]?.id,
      userId: users[1]?.id,
      rating: 5,
      comment: 'Perfect recipe! Easy to follow.',
      status: 'pending',
    },
  ]);
}
