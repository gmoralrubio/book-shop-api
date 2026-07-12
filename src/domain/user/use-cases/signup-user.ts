import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { UserRepository } from '@domain/user/repositories/UserRepository';
import { SecurityService } from '@domain/user/services/SecurityService';
import { User } from '@domain/user/User';

export interface SignupUserUseCaseInput {
  email: string;
  password: string;
}

export class SignupUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(
    userRepository: UserRepository,
    securityService: SecurityService
  ) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: SignupUserUseCaseInput): Promise<User> {
    const existingUser = await this.userRepository.findBy({
      email: input.email,
    });
    if (existingUser) {
      throw new BusinessConflictError('A user with same email already exists');
    }

    const hashedPassword = await this.securityService.hash(input.password);

    const user = await this.userRepository.signup({
      email: input.email,
      password: hashedPassword,
    });

    return user;
  }
}
