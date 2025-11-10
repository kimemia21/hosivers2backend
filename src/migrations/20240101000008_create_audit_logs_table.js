/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('audit_logs', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().nullable();
    table.string('action', 50).notNullable();
    table.string('object_type', 50).nullable();
    table.bigInteger('object_id').unsigned().nullable();
    table.json('changes').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign key
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');

    // Indexes
    table.index('user_id');
    table.index('action');
    table.index('object_type');
    table.index('object_id');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};
