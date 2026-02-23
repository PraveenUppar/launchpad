import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({ message: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(500, 'Title must be less than 500 characters')
      .trim(),
    completed: z.boolean().optional().default(false),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid todo ID format'),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(500, 'Title must be less than 500 characters')
      .trim()
      .optional(),
    completed: z.boolean().optional(),
  }),
});

export const getTodosQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => {
        const num = parseInt(val, 10);
        if (isNaN(num) || num < 1) return 1;
        return num;
      }),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform((val) => {
        const num = parseInt(val, 10);
        if (isNaN(num) || num < 1) return 10;
        if (num > 100) return 100; // Max limit
        return num;
      }),
  }),
});

export const todoParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid todo ID format'),
  }),
});
