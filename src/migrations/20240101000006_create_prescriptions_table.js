/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('prescriptions', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('patient_id').unsigned().notNullable();
    table.bigInteger('doctor_id').unsigned().notNullable();
    table.timestamp('issue_date').defaultTo(knex.fn.now());
    table.text('notes').nullable();
    table.enum('status', ['active', 'completed', 'cancelled']).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    table.foreign('doctor_id').references('id').inTable('doctors').onDelete('RESTRICT');

    // Indexes
    table.index('patient_id');
    table.index('doctor_id');
    table.index('status');
    table.index('issue_date');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('prescriptions');
};
