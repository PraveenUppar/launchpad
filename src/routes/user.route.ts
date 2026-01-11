import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
} from '../controllers/user.controller';
import validate from '../middlewares/validate.middleware';
import { loginSchema, signupSchema } from '../schemas/user.schema';

const userRouter = Router();

userRouter.post('/sign-up', validate(signupSchema), registerUserController);
userRouter.post('/login', validate(loginSchema), loginUserController);

export default userRouter;
