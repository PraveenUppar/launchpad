import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({ message: 'Title is required' })
      .min(1, 'Title cannot be empty'),
    completed: z.boolean().optional().default(false),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Todo ID is required' }),
  }),
  body: z.object({
    title: z.string().optional(),
    completed: z.boolean().optional(),
  }),
});
