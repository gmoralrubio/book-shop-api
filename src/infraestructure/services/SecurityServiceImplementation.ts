import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SecurityService } from '@domain/user/services/SecurityService';

export class SecurityServiceImplementation implements SecurityService {
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
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET_MISSING');
    }
    const token = jwt.sign({ userId }, JWT_SECRET);
    return token;
  }
}
