import { Request, Response } from 'express';

import {
  createTodoService,
  getTodoService,
  deleteTodoService,
  patchTodoService,
} from '../services/todo.service';

const postTodoController = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const { title, completed } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: 'Title is required' });
    }
    const newTodo = await createTodoService(userId, { title, completed });
    return res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create todo' });
  }
};
const getTodoController = async (req: Request, res: Response) => {
  try {
    const todos = await getTodoService();
    return res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: todos,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get todos' });
  }
};
const deleteTodoController = async (req: Request, res: Response) => {
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
    return res.status(500).json({ message: 'Failed to delete todos' });
  }
};
const patchTodoController = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Failed to update todo' });
  }
};

export {
  postTodoController,
  getTodoController,
  deleteTodoController,
  patchTodoController,
};
