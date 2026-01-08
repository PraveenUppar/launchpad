import { prisma } from '../libs/prisma.js';

interface TodoData {
  title: string;
  completed: boolean;
}
interface UpdateData {
  title?: string;
  completed?: boolean;
}

const createTodoService = async (userId: string, tododata: TodoData) => {
  const newTodo = await prisma.todo.create({
    data: {
      title: tododata.title,
      completed: tododata.completed,
      userId: userId,
    },
  });
  return newTodo;
};

const getTodoService = async () => {
  const todos = await prisma.todo.findMany();
  return todos;
};

const deleteTodoService = async (id: string) => {
  const todo = await prisma.todo.delete({ where: { id } });
  return todo;
};

const patchTodoService = async (id: string, tododata: UpdateData) => {
  const update = await prisma.todo.update({
    where: { id: id },
    data: tododata,
  });
  return update;
};

export {
  createTodoService,
  getTodoService,
  deleteTodoService,
  patchTodoService,
};
