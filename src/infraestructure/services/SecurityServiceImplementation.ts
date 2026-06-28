import bcrypt from 'bcrypt';
import { SecurityService } from '@domain/user/services/SecurityService';

export class SecurityServiceImplementation implements SecurityService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
