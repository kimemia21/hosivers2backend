const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries (in reverse order of dependencies)
  await knex('audit_logs').del();
  await knex('prescription_items').del();
  await knex('prescriptions').del();
  await knex('inventory').del();
  await knex('patients').del();
  await knex('doctors').del();
  await knex('departments').del();
  await knex('users').del();

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const doctorPassword = await bcrypt.hash('Doctor@123', 12);
  const pharmacistPassword = await bcrypt.hash('Pharmacist@123', 12);

  // Insert users
  const [adminId] = await knex('users').insert([
    {
      name: 'Alice Admin',
      email: 'alice@hospital.com',
      password_hash: adminPassword,
      role: 'admin',
    },
  ]);

  const [doctorUserId] = await knex('users').insert([
    {
      name: 'Dr. John Smith',
      email: 'john.smith@hospital.com',
      password_hash: doctorPassword,
      role: 'doctor',
    },
  ]);

  const [pharmacistUserId] = await knex('users').insert([
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      password_hash: pharmacistPassword,
      role: 'pharmacist',
    },
  ]);

  // Insert departments
  const [cardiologyId] = await knex('departments').insert([
    {
      name: 'Cardiology',
      description: 'Heart and cardiovascular system care',
    },
  ]);

  await knex('departments').insert([
    {
      name: 'Emergency',
      description: 'Emergency and urgent care services',
    },
    {
      name: 'Pediatrics',
      description: 'Child healthcare services',
    },
  ]);

  // Insert doctors
  const [doctorId] = await knex('doctors').insert([
    {
      user_id: doctorUserId,
      department_id: cardiologyId,
      license_number: 'MD-12345',
      specialization: 'Cardiology',
      phone: '+1-555-0100',
    },
  ]);

  // Insert inventory items
  const [amoxicillinId] = await knex('inventory').insert([
    {
      sku: 'MED-AMX-500',
      name: 'Amoxicillin 500mg',
      description: 'Antibiotic medication',
      batch_number: 'BATCH-2024-001',
      expiry_date: '2025-12-31',
      unit: 'tablets',
      quantity: 1000,
      location: 'Pharmacy A, Shelf 3',
    },
  ]);

  await knex('inventory').insert([
    {
      sku: 'MED-PARA-500',
      name: 'Paracetamol 500mg',
      description: 'Pain reliever and fever reducer',
      batch_number: 'BATCH-2024-002',
      expiry_date: '2026-06-30',
      unit: 'tablets',
      quantity: 2000,
      location: 'Pharmacy A, Shelf 1',
    },
    {
      sku: 'MED-IBU-400',
      name: 'Ibuprofen 400mg',
      description: 'Anti-inflammatory and pain reliever',
      batch_number: 'BATCH-2024-003',
      expiry_date: '2025-09-30',
      unit: 'tablets',
      quantity: 1500,
      location: 'Pharmacy A, Shelf 2',
    },
    {
      sku: 'SUP-SYRI-10ML',
      name: 'Disposable Syringe 10ml',
      description: 'Sterile disposable syringe',
      batch_number: 'BATCH-2024-100',
      expiry_date: '2027-12-31',
      unit: 'pieces',
      quantity: 500,
      location: 'Supply Room B',
    },
  ]);

  // Insert patients
  const [patientId] = await knex('patients').insert([
    {
      first_name: 'Jane',
      last_name: 'Doe',
      dob: '1985-03-15',
      gender: 'female',
      national_id: 'NAT123456789',
      phone: '+1-555-0200',
      email: 'jane.doe@email.com',
      address: '123 Main Street, Springfield, IL 62701',
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+1-555-0201',
      allergies: 'Penicillin, Peanuts',
      known_conditions: 'Hypertension, Type 2 Diabetes',
    },
  ]);

  // Insert prescriptions
  const [prescriptionId] = await knex('prescriptions').insert([
    {
      patient_id: patientId,
      doctor_id: doctorId,
      issue_date: knex.fn.now(),
      notes: 'Patient presenting with chest pain. ECG normal. Prescribed for symptom management.',
      status: 'active',
    },
  ]);

  // Insert prescription items
  await knex('prescription_items').insert([
    {
      prescription_id: prescriptionId,
      inventory_id: amoxicillinId,
      med_name: 'Amoxicillin 500mg',
      dose: '500mg',
      frequency: 'TID (three times daily)',
      route: 'oral',
      quantity: 21,
      instructions: 'Take with food. Complete the full course.',
    },
  ]);

  console.log('Seed data inserted successfully!');
  console.log('\nTest Credentials:');
  console.log('Admin: alice@hospital.com / Admin@123');
  console.log('Doctor: john.smith@hospital.com / Doctor@123');
  console.log('Pharmacist: sarah.johnson@hospital.com / Pharmacist@123');
};
