import { loginUserController } from '@ui/user/controllers/login-user-controller';
import { signupUserController } from '@ui/user/controllers/signup-user-controller';
import { Router } from 'express';

export const userRouter = Router();

userRouter.post('/signup', signupUserController);
userRouter.post('/login', loginUserController);
