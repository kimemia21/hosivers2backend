const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');
const bcrypt = require('bcrypt');

describe('Authentication Tests', () => {
  let adminToken;

  beforeAll(async () => {
    // Clean up and create test admin user
    await db('users').where({ email: 'test.admin@test.com' }).del();
    
    const hashedPassword = await bcrypt.hash('Test@Admin123', 12);
    await db('users').insert({
      name: 'Test Admin',
      email: 'test.admin@test.com',
      password_hash: hashedPassword,
      role: 'admin',
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db('users').where({ email: 'test.admin@test.com' }).del();
    await db('users').where({ email: 'test.newuser@test.com' }).del();
    await db.destroy();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test.admin@test.com',
          password: 'Test@Admin123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('test.admin@test.com');

      adminToken = res.body.data.token;
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test.admin@test.com',
          password: 'WrongPassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('fail');
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test.admin@test.com',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user (admin only)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New User',
          email: 'test.newuser@test.com',
          password: 'NewUser@123',
          role: 'receptionist',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.email).toBe('test.newuser@test.com');
    });

    it('should reject registration without admin token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Unauthorized User',
          email: 'unauthorized@test.com',
          password: 'Test@123',
          role: 'receptionist',
        });

      expect(res.statusCode).toBe(401);
    });

    it('should reject weak passwords', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Weak Password User',
          email: 'weak@test.com',
          password: 'weak',
          role: 'receptionist',
        });

      expect(res.statusCode).toBe(400);
    });
  });
});
