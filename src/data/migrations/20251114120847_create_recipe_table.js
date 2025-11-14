export async function up(knex) {
  await knex.schema.createTable("recipe", (table) => {
    table.uuid("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table.string("category").notNullable();
    table.integer("cookingTime").notNullable();
    table.enu("difficulty", ["easy", "medium", "hard"]).notNullable();
    table.text("instructions").notNullable();
    table.string("imageUrl");
    table.uuid("authorId").references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable("recipe");
}

