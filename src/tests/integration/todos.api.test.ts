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

  afterEach(() => {
    // Clean up env var
    delete process.env.TEST_USER_ID;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/v1/todos creates a todo', async () => {
    const response = await request(app).post('/api/v1/todos').send({
      title: 'Integration Test Todo',
      completed: false,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Integration Test Todo');
  });

  it('GET /api/v1/todos - returns paginated todos', async () => {
    const res = await request(app).get('/api/v1/todos?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.data)).toBe(true);
    expect(res.body.data.meta).toBeDefined();
    expect(res.body.data.meta.currentPage).toBe(1);
    expect(res.body.data.meta.itemsPerPage).toBe(10);
  });
});
