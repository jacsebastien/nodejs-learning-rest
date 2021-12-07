import { Request, Router } from "express";

import { RequestBody } from "../models/request-body";
import { Todo } from "../models/todo";

type GetTodosReq = Request<null, { todos: Todo[] }>;
type PostTodoReq = Request<{}, { todo: Todo }, RequestBody>;
type PutTodoReq = Request<
  { todoId: string },
  { todos: Todo[] } | { message: string },
  RequestBody
>;
type DeleteTodoReq = Request<{ todoId: string }, { id: string }>;

let todos: Todo[] = [];

const router = Router();

router.get("/", (req: GetTodosReq, res, next) => {
  res.status(200).json({ todos });
});

router.post("/todo", (req: PostTodoReq, res, next) => {
  const { text } = req.body;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
  };

  todos.push(newTodo);
  res.status(201).json({ todo: newTodo });
});

router.put("/todo/:todoId", (req: PutTodoReq, res, next) => {
  const { text } = req.body;
  const { todoId } = req.params;

  const todoIndex = todos.findIndex((t) => t.id === todoId);
  if (todoIndex !== -1) {
    todos[todoIndex] = {
      id: todos[todoIndex].id,
      text: text,
    };

    return res.status(200).json({ todos });
  }

  res.status(404).json({ message: "Todo not found" });
});

router.delete("/todo/:todoId", (req: DeleteTodoReq, res, next) => {
  const { todoId } = req.params;

  todos = todos.filter((t) => t.id !== todoId);

  return res.status(200).json({ id: todoId });
});

export default router;
