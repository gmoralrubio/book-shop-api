import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SecurityService } from '@domain/user/services/SecurityService';
import { environmentService } from '@infraestructure/EnvironmentService';

export class SecurityServiceImplementation implements SecurityService {
  private readonly JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = environmentService.get().JWT_SECRET;
  }

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  generateJWT(userId: number): string {
    environmentService.load();

    const token = jwt.sign({ userId }, this.JWT_SECRET);
    return token;
  }
}
