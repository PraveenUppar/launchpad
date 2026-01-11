import request from 'supertest';
import app from '../../app';
import { prisma } from '../../libs/prisma';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('Integration tests must not run outside test environment');
}

describe('Todo API - Integration Tests', () => {
  let testUserId: string;

  beforeEach(async () => {
    // Clean database
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

    // Create a REAL user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed-password',
      },
    });

    testUserId = user.id;
    // Make user ID available to auth middleware
    process.env.TEST_USER_ID = testUserId;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/v1/create creates a todo', async () => {
    const response = await request(app).post('/api/v1/create').send({
      title: 'Integration Test Todo',
      completed: false,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Integration Test Todo');
  });
});
