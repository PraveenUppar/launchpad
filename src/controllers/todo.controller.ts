import { Request, Response, NextFunction } from 'express';

import {
  createTodoService,
  getTodoService,
  deleteTodoService,
  patchTodoService,
} from '../services/todo.service';
import AppError from '../utils/AppError.js';

const postTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId;
  try {
    const { title, completed } = req.body;
    // zod validation
    // if (!title) {
    //   res.status(400).json({ success: false, message: 'Title is required' });
    // }
    const newTodo = await createTodoService(userId, { title, completed });
    return res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo,
    });
  } catch (error) {
    return next(new AppError('Failed to create todo', 500));
  }
};
const getTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const todos = await getTodoService();
    return res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: todos,
    });
  } catch (error) {
    return next(new AppError('Failed to create todo', 500));
  }
};
const deleteTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Todo does not exist' });
    }
    await deleteTodoService(id);
    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    return next(new AppError('Failed to delete todos', 500));
  }
};
const patchTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Todo does not exist' });
    }
    const { title, completed } = req.body;
    const updateTodo = await patchTodoService(id, { title, completed });
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updateTodo,
    });
  } catch (error) {
    return next(new AppError('Failed to update todo', 500));
  }
};

export {
  postTodoController,
  getTodoController,
  deleteTodoController,
  patchTodoController,
};
