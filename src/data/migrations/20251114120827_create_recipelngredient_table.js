export async function up(knex) {
  await knex.schema.createTable("recipeIngredient", (table) => {
    table.uuid("id").primary();
    table.uuid("recipeId").references("id").inTable("recipe").onDelete("CASCADE");
    table.uuid("ingredientId").references("id").inTable("ingredient").onDelete("CASCADE");
    table.decimal("quantity").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable("recipeIngredient");
}

