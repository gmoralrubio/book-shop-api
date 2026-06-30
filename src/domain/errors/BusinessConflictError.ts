import { DomainError } from '@domain/errors/DomainError';

export class BusinessConflictError extends DomainError {
  readonly name = 'BusinessConflictError';

  constructor(message: string) {
    super(message);
  }
}
