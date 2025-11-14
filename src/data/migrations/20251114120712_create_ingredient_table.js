export async function up(knex) {
  await knex.schema.createTable("ingredient", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.string("unit").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable("ingredient");
}

