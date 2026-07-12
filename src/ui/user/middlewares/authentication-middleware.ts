import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';
import { SecurityServiceImplementation } from '@infrastructure/user/services/SecurityServiceImplementation';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
