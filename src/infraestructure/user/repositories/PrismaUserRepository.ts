import { UserRepository } from '@domain/user/repositories/UserRepository';
import { SignupUserUseCaseInput } from '@domain/user/use-cases/signup-user';
import { User } from '@domain/user/User';
import prismaClient from '@infraestructure/shared/prisma-client';

interface PrismaUser {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaUserRepository implements UserRepository {
  private readonly prisma = prismaClient;

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { email } });
    if (!prismaUser) {
      return null;
    } else {
      return this.restore(prismaUser);
    }
  }
  async signup(params: SignupUserUseCaseInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: params.email,
        password: params.password,
      },
    });

    return this.restore(user);
  }

  private restore(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
