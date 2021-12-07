import { Router } from "express";
import { Todo } from "../models/todo";

let todos: Todo[] = [];

const router = Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ todos });
});

router.post("/todo", (req, res, next) => {
  const text: string = req.body.text;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
  };

  todos.push(newTodo);
  res.status(201).json({ todo: newTodo });
});

router.put("/todo/:todoId", (req, res, next) => {
  const todoId = req.params.todoId;
  const text: string = req.body.text;

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

router.delete("/todo/:todoId", (req, res, next) => {
  const todoId = req.params.todoId;

  todos = todos.filter((t) => t.id !== todoId);

  return res.status(200).json({ id: todoId });
});

export default router;
