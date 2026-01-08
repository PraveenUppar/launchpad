import { Request, Response, NextFunction } from 'express';
import {
  createUserService,
  findUserService,
  verifyUserService,
} from '../services/user.service.js';
import { generateToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    // zod validation
    // if (!email || !password) {
    //   return sendError(res, 400, 'Email and password are required');
    // }
    const newUser = await createUserService({ email, password });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { email: newUser.email },
    });
  } catch (error) {
    return next(new AppError('Failed to register user', 500));
  }
};

const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    //  zod validation
    // if (!email || !password) {
    //   return sendError(res, 400, 'Email and password are required');
    // }

    const user = await findUserService(email);
    if (!user) {
      return next(new AppError('Invalid credentials', 404));
    }
    const isPasswordValid = await verifyUserService(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 404));
    }
    const token = generateToken(user.id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: { email: user.email },
    });
  } catch (error) {
    return next(new AppError('Failed to login user', 500));
  }
};

export { registerUserController, loginUserController };
