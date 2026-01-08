import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  postTodoController,
  getTodoController,
  deleteTodoController,
  patchTodoController,
} from '../controllers/todo.controller';

const todoRouter = Router();
todoRouter.use(authMiddleware);

todoRouter.post('/create', postTodoController);
todoRouter.get('/todo', getTodoController);
todoRouter.delete('/todo/:id', deleteTodoController);
todoRouter.patch('/todo/:id', patchTodoController);

export default todoRouter;
