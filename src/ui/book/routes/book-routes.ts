import { createBookController } from '@ui/book/controllers/create-book-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';
import { Router } from 'express';

export const bookRouter = Router();
bookRouter.post('/', [authenticationMiddleware, createBookController]);
