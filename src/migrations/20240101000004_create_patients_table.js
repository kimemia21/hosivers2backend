/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('patients', (table) => {
    table.bigIncrements('id').primary();
    table.string('first_name', 150).notNullable();
    table.string('last_name', 150).notNullable();
    table.date('dob').nullable();
    table.enum('gender', ['male', 'female', 'other']).defaultTo('other');
    table.string('national_id', 100).nullable(); // Consider encrypting in production
    table.string('phone', 50).nullable();
    table.string('email', 255).nullable();
    table.text('address').nullable();
    table.string('emergency_contact_name', 200).nullable();
    table.string('emergency_contact_phone', 50).nullable();
    table.text('allergies').nullable();
    table.text('known_conditions').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index(['first_name', 'last_name']);
    table.index('phone');
    table.index('email');
    table.index('deleted_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('patients');
};
