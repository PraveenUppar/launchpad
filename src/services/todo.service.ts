import { prisma } from '../libs/prisma.js';
import redis from '../redis/redis.js';

const invalidateTodoCache = async () => {
  const keys = await redis.keys('todos:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

const createTodoService = async (
  userId: string,
  tododata: { title: string; completed: boolean },
) => {
  const newTodo = await prisma.todo.create({
    data: {
      title: tododata.title,
      completed: tododata.completed,
      userId: userId,
    },
  });
  await invalidateTodoCache();
  return newTodo;
};

const getTodoService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const cacheKey = `todos:page:${page}:limit:${limit}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // const todos = await prisma.todo.findMany();
  // return { data: todos, meta: { total: todos.length } };

  const [todos, total] = await prisma.$transaction([
    prisma.todo.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.todo.count(),
  ]);

  const result = {
    data: todos,
    meta: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    },
  };

  await redis.set(cacheKey, result, { ex: 3600 });
  return result;
};

const deleteTodoService = async (id: string) => {
  const todo = await prisma.todo.delete({ where: { id } });
  await invalidateTodoCache();
  return todo;
};

const patchTodoService = async (id: string, tododata: any) => {
  const update = await prisma.todo.update({ where: { id }, data: tododata });
  await invalidateTodoCache();
  return update;
};

export {
  createTodoService,
  getTodoService,
  deleteTodoService,
  patchTodoService,
};
