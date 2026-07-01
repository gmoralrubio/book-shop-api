import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { SecurityServiceImplementation } from '@infraestructure/user/services/SecurityServiceImplementation';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new UnauthorizedError('Token not in request');
  }

  const sanitizedToken = token.replace('Bearer ', '');

  const securityService = new SecurityServiceImplementation();
  const decodedToken = securityService.verifyJWT(sanitizedToken);

  req.userId = decodedToken?.userId;

  if (decodedToken) {
    next();
  } else {
    throw new UnauthorizedError('Token not valid');
  }
};
