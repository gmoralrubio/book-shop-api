import { SignupUserUseCase } from '@domain/user/use-cases/signup-user';
import { SecurityServiceImplementation } from '@infraestructure/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';
import { Request, Response } from 'express';

export const signupUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'EMAIL_AND_PASSWORD_MUST_BE_PROVIDED' });
    return;
  }

  const prismaUserRepository = new PrismaUserRepository();
  const securityService = new SecurityServiceImplementation();
  const signupUserUserCase = new SignupUserUseCase(
    prismaUserRepository,
    securityService
  );
  try {
    await signupUserUserCase.execute({ email, password });
  } catch (error) {
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    res.status(500).json({ error: msg });
    return;
  }

  res.status(201).send({ message: 'USER_CREATED_SUCCESSFULLY' });
};
