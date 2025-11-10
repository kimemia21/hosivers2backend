const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');
const bcrypt = require('bcrypt');

describe('Patient Tests', () => {
  let adminToken;
  let patientId;

  beforeAll(async () => {
    // Create test admin user
    await db('users').where({ email: 'admin.patient@test.com' }).del();
    
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    await db('users').insert({
      name: 'Admin Patient Test',
      email: 'admin.patient@test.com',
      password_hash: hashedPassword,
      role: 'admin',
    });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin.patient@test.com',
        password: 'Admin@123',
      });

    adminToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    // Clean up
    if (patientId) {
      await db('patients').where({ id: patientId }).del();
    }
    await db('users').where({ email: 'admin.patient@test.com' }).del();
    await db.destroy();
  });

  describe('POST /api/v1/patients', () => {
    it('should create a new patient', async () => {
      const res = await request(app)
        .post('/api/v1/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'John',
          last_name: 'Test',
          dob: '1990-01-01',
          gender: 'male',
          phone: '+1234567890',
          email: 'john.test@email.com',
          address: '123 Test Street',
          allergies: 'None',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.first_name).toBe('John');
      expect(res.body.data.last_name).toBe('Test');

      patientId = res.body.data.id;
    });

    it('should reject invalid patient data', async () => {
      const res = await request(app)
        .post('/api/v1/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'J', // Too short
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/patients', () => {
    it('should get all patients with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
    });

    it('should search patients', async () => {
      const res = await request(app)
        .get('/api/v1/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: 'John' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should sort patients by valid fields', async () => {
      const validSortFields = ['first_name', 'last_name', 'dob', 'gender', 'email', 'phone', 'created_at', 'updated_at'];
      
      for (const sortField of validSortFields) {
        const res = await request(app)
          .get('/api/v1/patients')
          .set('Authorization', `Bearer ${adminToken}`)
          .query({ sort: sortField, order: 'asc' });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
      }
    });

    it('should reject invalid sort field', async () => {
      const res = await request(app)
        .get('/api/v1/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ sort: 'invalid_field' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('must be one of');
    });
  });

  describe('GET /api/v1/patients/:id', () => {
    it('should get patient by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/patients/${patientId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.id).toBe(patientId);
    });

    it('should return 404 for non-existent patient', async () => {
      const res = await request(app)
        .get('/api/v1/patients/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/v1/patients/:id', () => {
    it('should update patient', async () => {
      const res = await request(app)
        .put(`/api/v1/patients/${patientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          phone: '+9876543210',
          allergies: 'Penicillin',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.phone).toBe('+9876543210');
      expect(res.body.data.allergies).toBe('Penicillin');
    });
  });
});
