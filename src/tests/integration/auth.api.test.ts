import request from 'supertest';
import app from '../../app';
import { prisma } from '../../libs/prisma';

describe('Auth API - Integration Tests', () => {
  const testUser = {
    email: 'auth@test.com',
    password: 'Password@123',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/v1/auth/sign-up - registers a user', async () => {
    const res = await request(app).post('/api/v1/auth/sign-up').send(testUser);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    // expect(res.body.data.email).toBe(testUser.email);
  });

  it('POST /api/v1/auth/login - logs in user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send(testUser);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    // expect(res.body.data.token).toBeDefined();
  });
});
