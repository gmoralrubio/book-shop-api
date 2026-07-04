import z from 'zod';

export const createBookValidationSchema = z.object({
  title: z
    .string('Title is required')
    .min(3, 'Minimum title length is 3 characters'),
  description: z
    .string('Description si required')
    .min(15, 'Minimum description length is 15 characters'),
  price: z.number('Price is required').positive('Price can not be negative'),
  author: z
    .string('Author si required')
    .min(3, 'Minimum author length is 3 characters'),
});
export const updateBookValidationSchema = z.object({
  title: z.string().min(3, 'Minimum title length is 3 characters').optional(),
  description: z
    .string()
    .min(15, 'Minimum description length is 15 characters')
    .optional(),
  price: z.number().positive('Price can not be negative').optional(),
  author: z.string().min(3, 'Minimum author length is 3 characters').optional(),
});

export const idParamValidationSchema = z.object({
  id: z.coerce.number('Invalid id. Must be a number'),
});
