import { Request, Response } from 'express';
import {
  createUserService,
  findUserService,
  verifyUserService,
} from '../services/user.service.js';
import { generateToken } from '../utils/jwt.js';

const sendError = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({ success: false, message });
};

const registerUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }
    const newUser = await createUserService({ email, password });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return sendError(res, 409, 'User already exists');
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await findUserService(email);
    if (!user) {
      return sendError(res, 404, 'Invalid credentials');
    }

    const isPasswordValid = await verifyUserService(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user.id);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: { email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { registerUserController, loginUserController };
