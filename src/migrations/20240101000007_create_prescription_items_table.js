/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('prescription_items', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('prescription_id').unsigned().notNullable();
    table.bigInteger('inventory_id').unsigned().nullable();
    table.string('med_name', 255).notNullable();
    table.string('dose', 100).nullable();
    table.string('frequency', 100).nullable();
    table.string('route', 100).nullable();
    table.integer('quantity').nullable();
    table.text('instructions').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('prescription_id').references('id').inTable('prescriptions').onDelete('CASCADE');
    table.foreign('inventory_id').references('id').inTable('inventory').onDelete('SET NULL');

    // Indexes
    table.index('prescription_id');
    table.index('inventory_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('prescription_items');
};
