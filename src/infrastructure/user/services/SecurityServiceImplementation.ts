import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SecurityService } from '@domain/user/services/SecurityService';
import { JwtPayload } from '@domain/user/types/JwtPayload';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';

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
  verifyJWT(token: string): JwtPayload | null {
    try {
      const decodedToken = jwt.verify(token, this.JWT_SECRET);
      return decodedToken as JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }
}
