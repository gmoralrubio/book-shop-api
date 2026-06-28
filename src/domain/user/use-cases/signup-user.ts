import { UserRepository } from '@domain/user/repositories/UserRepository';
import { SecurityService } from '@domain/user/services/SecurityService';
import { User } from '@prisma/client';

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
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('INVALID_CREDENTIALS');
    }

    this.validatePassword(input.password);
    this.validateEmail(input.email);

    const hashedPassword = await this.securityService.hash(input.password);

    const user = await this.userRepository.signup({
      email: input.email,
      password: hashedPassword,
    });

    return user;
  }

  private validatePassword(password: string) {
    const passwordRegExp = new RegExp(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/
    );

    if (!passwordRegExp.test(password)) {
      throw new Error('INVALID_CREDENTIALS');
    }
  }

  private validateEmail(email: string) {
    const emailRegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!emailRegExp.test(email)) {
      throw new Error('INVALID_CREDENTIALS');
    }
  }
}
