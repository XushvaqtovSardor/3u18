export async function up(knex) {
    await knex.schema.createTable('users',(table)=>{
        table.uuid('id').primary();
        table.string('email').notNullable();
        table.string('username').notNullable();
        table.string("password").notNullable();
        table.enu('role',['admin','user']).notNullable();
        table.enu("status",['active','inactive']);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
    });
};
export async function down(knex){
    await knex.schema.dropTable('users')
};