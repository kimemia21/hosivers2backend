const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');
const bcrypt = require('bcrypt');

describe('Prescription Tests', () => {
  let adminToken;
  let patientId;
  let doctorId;
  let inventoryId;
  let prescriptionId;

  beforeAll(async () => {
    // Create test admin user
    await db('users').where({ email: 'admin.prescription@test.com' }).del();
    
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const [adminUserId] = await db('users').insert({
      name: 'Admin Prescription Test',
      email: 'admin.prescription@test.com',
      password_hash: hashedPassword,
      role: 'admin',
    });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin.prescription@test.com',
        password: 'Admin@123',
      });

    adminToken = loginRes.body.data.token;

    // Create test doctor user
    const [doctorUserId] = await db('users').insert({
      name: 'Dr. Test Prescription',
      email: 'doctor.prescription@test.com',
      password_hash: hashedPassword,
      role: 'doctor',
    });

    // Create doctor profile
    [doctorId] = await db('doctors').insert({
      user_id: doctorUserId,
      license_number: 'TEST-LIC-001',
      specialization: 'General Medicine',
    });

    // Create test patient
    [patientId] = await db('patients').insert({
      first_name: 'Test',
      last_name: 'Patient',
      dob: '1990-01-01',
      gender: 'male',
      phone: '+1234567890',
    });

    // Create test inventory item
    [inventoryId] = await db('inventory').insert({
      sku: 'TEST-MED-001',
      name: 'Test Medication',
      quantity: 100,
      unit: 'tablets',
    });
  });

  afterAll(async () => {
    // Clean up
    if (prescriptionId) {
      await db('prescription_items').where({ prescription_id: prescriptionId }).del();
      await db('prescriptions').where({ id: prescriptionId }).del();
    }
    await db('inventory').where({ id: inventoryId }).del();
    await db('patients').where({ id: patientId }).del();
    await db('doctors').where({ id: doctorId }).del();
    await db('users').where({ email: 'admin.prescription@test.com' }).del();
    await db('users').where({ email: 'doctor.prescription@test.com' }).del();
    await db.destroy();
  });

  describe('POST /api/v1/prescriptions', () => {
    it('should create a prescription with inventory deduction', async () => {
      const res = await request(app)
        .post('/api/v1/prescriptions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          patient_id: patientId,
          doctor_id: doctorId,
          notes: 'Test prescription',
          items: [
            {
              inventory_id: inventoryId,
              med_name: 'Test Medication',
              dose: '500mg',
              frequency: 'BID',
              route: 'oral',
              quantity: 10,
              instructions: 'Take with food',
            },
          ],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('items');
      expect(res.body.data.items.length).toBe(1);

      prescriptionId = res.body.data.id;

      // Verify inventory was decremented
      const inventory = await db('inventory').where({ id: inventoryId }).first();
      expect(inventory.quantity).toBe(90); // 100 - 10
    });

    it('should reject prescription with insufficient inventory', async () => {
      const res = await request(app)
        .post('/api/v1/prescriptions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          patient_id: patientId,
          doctor_id: doctorId,
          items: [
            {
              inventory_id: inventoryId,
              med_name: 'Test Medication',
              quantity: 1000, // More than available
            },
          ],
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Insufficient stock');
    });

    it('should create prescription without inventory item', async () => {
      const res = await request(app)
        .post('/api/v1/prescriptions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          patient_id: patientId,
          doctor_id: doctorId,
          items: [
            {
              med_name: 'Non-inventory Medication',
              dose: '250mg',
              frequency: 'QD',
              instructions: 'Test',
            },
          ],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
    });
  });

  describe('GET /api/v1/prescriptions/:id', () => {
    it('should get prescription by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/prescriptions/${prescriptionId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.id).toBe(prescriptionId);
    });
  });
});
