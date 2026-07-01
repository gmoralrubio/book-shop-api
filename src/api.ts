import { bookRouter } from '@ui/book/routes/book-routes';
import { errorHandlerMiddleware } from '@ui/shared/middlewares/error-handler-middleware';

import { userRouter } from '@ui/user/routes/user-routes';
import express from 'express';

const api = express();

api.use(express.json());
api.use('/authentication', userRouter);
api.use('/books', bookRouter);

api.use(errorHandlerMiddleware);

export default api;
