export async function up(knex) {
  await knex.schema.createTable('otp', (table) => {
    table.uuid('id').primary();
    table.string('email').notNullable();
    table.string('otp').notNullable();
    table.timestamp('expiresAt').notNullable();
    table.boolean('verified').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable('otp');
}
