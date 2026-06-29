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

  async execute(params: LoginUserUseCaseInput): Promise<string> {
    const user = await this.userRepository.findByEmail(params.email);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }
    const isMatch = await this.securityService.comparePassword(
      params.password,
      user.password
    );

    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = this.securityService.generateJWT(user.id);
    return token;
  }
}
