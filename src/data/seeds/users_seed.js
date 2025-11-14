import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function seed(knex) {
  await knex('users').del();

  
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordUser = await bcrypt.hash('user123', 10);
  await knex('users').insert([
    {
      id: uuidv4(),
      email: 'admin@example.com',
      username: 'admin',
      password: passwordAdmin,
      role: 'admin',
      status: 'active',
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuidv4(),
      email: 'user1@example.com',
      username: 'user1',
      password: passwordUser,
      role: 'user',
      status: 'active',
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuidv4(),
      email: 'user2@example.com',
      username: 'user2',
      password: passwordUser,
      role: 'user',
      status: 'inactive',
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    }
  ]);
}
