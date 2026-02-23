import { z } from 'zod';

const passwordSchema = z
  .string({ message: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(128, { message: 'Password must be less than 128 characters' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  });

export const signupSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Email is required' }).toLowerCase().trim(),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email format' })
      .toLowerCase()
      .trim(),
    password: z.string({ message: 'Password is required' }),
  }),
});
