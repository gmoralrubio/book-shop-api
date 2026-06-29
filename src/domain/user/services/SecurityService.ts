export interface SecurityService {
  hash(password: string): Promise<string>;
  comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  generateJWT(userId: number): string;
}
