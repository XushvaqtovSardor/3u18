import { randomUUID } from 'crypto';

export async function seed(knex) {
  await knex('ingredient').del();

  await knex('ingredient').insert([
    { id: randomUUID(), name: 'Flour', unit: 'kg' },
    { id: randomUUID(), name: 'Sugar', unit: 'kg' },
    { id: randomUUID(), name: 'Salt', unit: 'kg' },
    { id: randomUUID(), name: 'Eggs', unit: 'pcs' },
    { id: randomUUID(), name: 'Milk', unit: 'liter' },
    { id: randomUUID(), name: 'Butter', unit: 'kg' },
    { id: randomUUID(), name: 'Chicken', unit: 'kg' },
    { id: randomUUID(), name: 'Tomato', unit: 'kg' },
    { id: randomUUID(), name: 'Onion', unit: 'kg' },
    { id: randomUUID(), name: 'Garlic', unit: 'kg' },
    { id: randomUUID(), name: 'Rice', unit: 'kg' },
    { id: randomUUID(), name: 'Pasta', unit: 'kg' },
    { id: randomUUID(), name: 'Cheese', unit: 'kg' },
    { id: randomUUID(), name: 'Olive Oil', unit: 'liter' },
    { id: randomUUID(), name: 'Carrot', unit: 'kg' },
  ]);
}
