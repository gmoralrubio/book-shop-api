import z from 'zod';

export const userQueryParamsValidationSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? 'Email is required'
        : 'Email does not comply with validation rules',
  }),
  password: z
    .string({
      error: 'Password is required',
    })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/, {
      error: 'Password does not comply with validation rules',
    }),
});
