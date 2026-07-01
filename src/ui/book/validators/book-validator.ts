import z from 'zod';

export const bookQueryParamsValidationSchema = z.object({
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
