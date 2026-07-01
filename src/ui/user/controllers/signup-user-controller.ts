import { SignupUserUseCase } from '@domain/user/use-cases/signup-user';
import { SecurityServiceImplementation } from '@infraestructure/user/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';
import { NextFunction, Request, Response } from 'express';
import { userQueryParamsValidationSchema } from '@ui/user/validators/user-validator';

export const signupUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = userQueryParamsValidationSchema.parse(req.body);

    const prismaUserRepository = new PrismaUserRepository();
    const securityService = new SecurityServiceImplementation();
    const signupUserUserCase = new SignupUserUseCase(
      prismaUserRepository,
      securityService
    );
    await signupUserUserCase.execute({ email, password });
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};
