import { Router } from "express";
import { Todo } from "../models/todo";

const todos: Todo[] = [];

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
  res.status(200).json({ newTodo });
});

export default router;
