import z from 'zod';

export const createBookValidationSchema = z.object({
  title: z
    .string('Title is required')
    .min(3, 'Minimum title length is 3 characters'),
  description: z
    .string('Description is required')
    .min(15, 'Minimum description length is 15 characters'),
  price: z.number('Price is required').positive('Price can not be negative'),
  author: z
    .string('Author is required')
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

export const findBookValidationSchema = z.object({
  page: z.coerce.number('Invalid page. Must be a number').positive().default(1),
  limit: z.coerce
    .number('Invalid limit. Must be a number')
    .positive()
    .max(100)
    .default(10),
  search: z.string().min(3).optional(),
});

export const idParamValidationSchema = z.object({
  id: z.coerce.number('Invalid id. Must be a number'),
});
