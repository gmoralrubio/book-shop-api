export interface SecurityService {
  hash(password: string): Promise<string>;
}
