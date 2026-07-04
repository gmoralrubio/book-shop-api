import { bookRouter } from '@ui/book/routes/book-routes';
import { meRouter } from '@ui/book/routes/me-book-routes';
import { errorHandlerMiddleware } from '@ui/shared/middlewares/error-handler-middleware';

import { userRouter } from '@ui/user/routes/user-routes';
import express from 'express';

const api = express();

api.use(express.json());

api.use('/authentication', userRouter);
api.use('/books', bookRouter);
api.use('/me', meRouter);

api.use(errorHandlerMiddleware);

export default api;
