//write the route logic for user login and signin user

import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/sign-up', registerUserController);
userRouter.post('/sign-in', loginUserController);

export default userRouter;
