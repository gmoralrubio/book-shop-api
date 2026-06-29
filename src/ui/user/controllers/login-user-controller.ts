import { LoginUserUseCase } from '@domain/user/use-cases/login-user';
import { SecurityServiceImplementation } from '@infraestructure/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';
import { Request, Response } from 'express';

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'EMAIL_AND_PASSWORD_MUST_BE_PROVIDED' });
    return;
  }

  const prismaUserRepository = new PrismaUserRepository();
  const securityService = new SecurityServiceImplementation();
  const loginUserUseCase = new LoginUserUseCase(
    prismaUserRepository,
    securityService
  );

  try {
    const token = await loginUserUseCase.execute({ email, password });
    res.status(200).json({ accessToken: token });
  } catch (error) {
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    res.status(500).json({ error: msg });
    return;
  }
};
