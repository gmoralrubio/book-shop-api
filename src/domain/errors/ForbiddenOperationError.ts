import { DomainError } from '@domain/errors/DomainError';

export class ForbiddenOperationError extends DomainError {
  readonly name = 'ForbiddenOperationError';

  constructor(message: string) {
    super(message);
  }
}
