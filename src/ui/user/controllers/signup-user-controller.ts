import { SignupUserUseCase } from '@domain/user/use-cases/signup-user';
import { SecurityServiceImplementation } from '@infraestructure/user/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';
import { NextFunction, Request, Response } from 'express';
import { userValidationSchema } from '@ui/user/validators/user-validator';

export const signupUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaUserRepository = new PrismaUserRepository();
  const securityService = new SecurityServiceImplementation();
  const signupUserUserCase = new SignupUserUseCase(
    prismaUserRepository,
    securityService
  );
  try {
    const { email, password } = userValidationSchema.parse(req.body);

    await signupUserUserCase.execute({ email, password });
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};
