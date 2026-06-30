import { DomainError } from '@domain/errors/DomainError';

export class BadSyntaxError extends DomainError {
  readonly name = 'BadSyntaxError';

  constructor(message: string) {
    super(message);
  }
}
