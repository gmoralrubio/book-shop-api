import { SignupUserUseCase } from '@domain/user/use-cases/signup-user';
import { SecurityServiceImplementation } from '@infrastructure/user/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '@infrastructure/user/repositories/PrismaUserRepository';
import { NextFunction, Request, Response } from 'express';
import { userValidationSchema } from '@ui/user/validators/user-validator';

export const signupUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaUserRepository = new PrismaUserRepository();
  const securityService = new SecurityServiceImplementation();
  const signupUserUseCase = new SignupUserUseCase(
    prismaUserRepository,
    securityService
  );
  try {
    const { email, password } = userValidationSchema.parse(req.body);

    await signupUserUseCase.execute({ email, password });
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};
