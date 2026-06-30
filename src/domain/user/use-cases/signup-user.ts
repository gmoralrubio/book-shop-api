import { BadSyntaxError } from '@domain/errors/BadSyntaxError';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
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
      throw new BusinessConflictError('An user with same email already exists');
    }

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
      throw new BadSyntaxError(
        'Password does not comply with validation rules'
      );
    }
  }

  private validateEmail(email: string) {
    const emailRegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!emailRegExp.test(email)) {
      throw new BadSyntaxError('Email does not comply with validation rules');
    }
  }
}
