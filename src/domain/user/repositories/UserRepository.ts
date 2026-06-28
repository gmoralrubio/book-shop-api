import { SignupUserUseCaseInput } from '@domain/user/use-cases/signup-user';
import { User } from '@prisma/client';

export interface UserRepository {
  signup: (params: SignupUserUseCaseInput) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
}
