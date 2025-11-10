/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('inventory', (table) => {
    table.bigIncrements('id').primary();
    table.string('sku', 100).notNullable().unique();
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.string('batch_number', 100).nullable();
    table.date('expiry_date').nullable();
    table.string('unit', 50).nullable();
    table.integer('quantity').defaultTo(0);
    table.string('location', 150).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('sku');
    table.index('name');
    table.index('expiry_date');
    table.index('batch_number');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('inventory');
};
