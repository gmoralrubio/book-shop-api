import { DomainError } from '@domain/errors/DomainError';

export class UnauthorizedError extends DomainError {
  readonly name = 'UnauthorizedError';

  constructor(message: string) {
    super(message);
  }
}
