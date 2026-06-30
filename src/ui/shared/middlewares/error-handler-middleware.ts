import { BadSyntaxError } from '@domain/errors/BadSyntaxError';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { ConfigurationError } from '@domain/errors/ConfigurationError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { ForbiddenOperationError } from '@domain/errors/ForbiddenOperationError';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// TODO: Refactorizar para mapear errores: status code

export const errorHandlerMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof BadSyntaxError) {
    res.status(400).json({ error: error.message });
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
  }

  if (error instanceof ForbiddenOperationError) {
    res.status(403).json({ error: error.message });
  }

  if (error instanceof EntityNotFoundError) {
    res.status(404).json({ error: error.message });
  }

  if (error instanceof BusinessConflictError) {
    res.status(409).json({ error: error.message });
  }

  if (error instanceof ConfigurationError) {
    res.status(500).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: error.issues[0].message,
    });
  }
};
