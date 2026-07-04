import { findBooksController } from '@ui/book/controllers/find-books-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';
import { Router } from 'express';

export const meRouter = Router();

meRouter.get('/books', [authenticationMiddleware, findBooksController]);
