import { LoginUserUseCase } from '@domain/user/use-cases/login-user';
import { SecurityServiceImplementation } from '@infraestructure/user/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';
import { NextFunction, Request, Response } from 'express';
import { userCredentialsValidationSchema } from '@ui/user/user-credentials-validation';

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = userCredentialsValidationSchema.parse(req.body);

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
