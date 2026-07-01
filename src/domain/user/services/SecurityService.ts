import { JwtPayload } from '@domain/user/types/JwtPayload';

export interface SecurityService {
  hash(password: string): Promise<string>;
  comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  generateJWT(userId: number): string;
  verifyJWT(token: string): JwtPayload | null;
}
