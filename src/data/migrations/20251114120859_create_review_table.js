export async function up(knex) {
  await knex.schema.createTable("review", (table) => {
    table.uuid("id").primary();
    table.uuid("recipeId").references("id").inTable("recipe").onDelete("CASCADE");
    table.uuid("userId").references("id").inTable("users").onDelete("CASCADE");
    table.smallint("rating").notNullable();
    table.text("comment");
    table.enu("status", ["approved", "pending", "rejected"]).defaultTo("pending");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable("review");
}

