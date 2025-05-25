const request = require('supertest');
const app = require('../../backend/server');
const { testPool, generateTestUser, clearTestDatabase } = require('../testUtils');

beforeEach(async () => {
  await clearTestDatabase();
});

describe('Auth Integration', () => {
  it('should register and login user', async () => {
    const testUser = generateTestUser();
    
    // Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.token).toBeDefined();
    
    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        lozinka: testUser.lozinka
      });
    
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});