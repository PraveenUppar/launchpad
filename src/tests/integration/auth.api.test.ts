// Unmock bcrypt for integration tests - we need real hashing
jest.unmock('bcrypt');

import request from 'supertest';
import app from '../../app';
import { prisma } from '../../libs/prisma';

describe('Auth API - Integration Tests', () => {
  const testUser = {
    email: 'auth@test.com',
    password: 'Password@123',
  };

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/v1/auth/sign-up - registers a user', async () => {
    const res = await request(app).post('/api/v1/auth/sign-up').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it('POST /api/v1/auth/login - logs in user', async () => {
    // First create the user
    await request(app).post('/api/v1/auth/sign-up').send(testUser);

    // Then try to login
    const res = await request(app).post('/api/v1/auth/login').send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('POST /api/v1/auth/login - returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
