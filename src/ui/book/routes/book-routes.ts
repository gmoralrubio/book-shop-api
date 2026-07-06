import { buyBookController } from '@ui/book/controllers/buy-book-controller';
import { createBookController } from '@ui/book/controllers/create-book-controller';
import { deleteBookController } from '@ui/book/controllers/delete-book-controller';
import { findBooksController } from '@ui/book/controllers/find-books-controller';
import { updateBookController } from '@ui/book/controllers/update-book-controller';
import { authenticationMiddleware } from '@ui/user/middlewares/authentication-middleware';
import { Router } from 'express';

export const bookRouter = Router();

bookRouter.get('/', findBooksController);
bookRouter.post('/', [authenticationMiddleware, createBookController]);
bookRouter.put('/:id', [authenticationMiddleware, updateBookController]);
bookRouter.delete('/:id', [authenticationMiddleware, deleteBookController]);
bookRouter.post('/:id/buy', [authenticationMiddleware, buyBookController]);
