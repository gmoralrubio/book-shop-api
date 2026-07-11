import { FindUserByParams } from '@domain/user/types/FindUserByParams';
import { SignupUserUseCaseInput } from '@domain/user/use-cases/signup-user';
import { User } from '@prisma/client';

export interface UserRepository {
  signup: (params: SignupUserUseCaseInput) => Promise<User>;
  findBy: (params: FindUserByParams) => Promise<User | null>;
}
