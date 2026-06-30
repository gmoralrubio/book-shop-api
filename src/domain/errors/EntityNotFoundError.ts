import { DomainError } from '@domain/errors/DomainError';

export class EntityNotFoundError extends DomainError {
  readonly name = 'EntityNotFoundError';

  constructor(entity: string, id: string) {
    super(`Entity ${entity} not found with id ${id}`);
  }
}
