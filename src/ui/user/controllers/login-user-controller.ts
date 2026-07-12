import { LoginUserUseCase } from '@domain/user/use-cases/login-user';
import { SecurityServiceImplementation } from '@infrastructure/user/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '@infrastructure/user/repositories/PrismaUserRepository';
import { NextFunction, Request, Response } from 'express';
import { userValidationSchema } from '@ui/user/validators/user-validator';

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = userValidationSchema.parse(req.body);

    const prismaUserRepository = new PrismaUserRepository();
    const securityService = new SecurityServiceImplementation();
    const loginUserUseCase = new LoginUserUseCase(
      prismaUserRepository,
      securityService
    );

    const token = await loginUserUseCase.execute({ email, password });
    res.status(200).json({ accessToken: token });
  } catch (error) {
    next(error);
  }
};
