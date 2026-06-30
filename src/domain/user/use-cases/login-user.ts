import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { UserRepository } from '@domain/user/repositories/UserRepository';
import { SecurityService } from '@domain/user/services/SecurityService';

export interface LoginUserUseCaseInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(
    userRepository: UserRepository,
    securityService: SecurityService
  ) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: LoginUserUseCaseInput): Promise<string> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new EntityNotFoundError('User', input.email);
    }
    const isMatch = await this.securityService.comparePassword(
      input.password,
      user.password
    );

    if (!isMatch) {
      throw new UnauthorizedError('Wrong password');
    }

    const token = this.securityService.generateJWT(user.id);
    return token;
  }
}
