import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  postTodoController,
  getTodoController,
  deleteTodoController,
  patchTodoController,
} from '../controllers/todo.controller';
import validate from '../middlewares/validate.middleware';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema';

const todoRouter = Router();
todoRouter.use(authMiddleware);

todoRouter.post('/create', validate(createTodoSchema), postTodoController);
todoRouter.get('/todo', getTodoController);
todoRouter.delete('/todo/:id', deleteTodoController);
todoRouter.patch('/todo/:id', validate(updateTodoSchema), patchTodoController);

export default todoRouter;
