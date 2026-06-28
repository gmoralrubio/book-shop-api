import { userRouter } from '@ui/user/routes/user-routes';
import express from 'express';

const api = express();

api.use(express.json());
api.use('/authentication', userRouter);

export default api;
