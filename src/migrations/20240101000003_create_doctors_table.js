/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('doctors', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable();
    table.integer('department_id').unsigned().nullable();
    table.string('license_number', 100).nullable();
    table.string('specialization', 150).nullable();
    table.string('phone', 50).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('department_id').references('id').inTable('departments').onDelete('SET NULL');

    // Indexes
    table.index('user_id');
    table.index('department_id');
    table.index('license_number');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('doctors');
};
