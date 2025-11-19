export async function up(knex) {
    await knex.schema.createTable('users',(table)=>{
        table.string("role")
        table.text()
    })
}
export async function down(knex) {
    await knex.schema.dropTable("users")
}