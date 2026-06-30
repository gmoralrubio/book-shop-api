import { DomainError } from '@domain/errors/DomainError';

export class ConfigurationError extends DomainError {
  readonly name = 'ConfigurationError';

  constructor(message: string) {
    super(message);
  }
}
