import { RequestHandler } from "express";

import { RequestBody } from "../models/request-body";
import { RequestParams } from "../models/request-params";
import { Todo } from "../models/todo";

type GetTodosReq = RequestHandler<null, { todos: Todo[] }>;
type PostTodoReq = RequestHandler<{}, { todo: Todo }, RequestBody>;
type PutTodoReq = RequestHandler<
  RequestParams,
  { todos: Todo[] } | { message: string },
  RequestBody
>;
type DeleteTodoReq = RequestHandler<RequestParams, { id: string }>;

let todos: Todo[] = [];

export const getTodos: GetTodosReq = (req, res, next) => {
  res.status(200).json({ todos });
};

export const postTodo: PostTodoReq = (req, res, next) => {
  const { text } = req.body;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
  };

  todos.push(newTodo);
  res.status(201).json({ todo: newTodo });
};

export const putTodo: PutTodoReq = (req, res, next) => {
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
};

export const deleteTodo: DeleteTodoReq = (req, res, next) => {
  const { todoId } = req.params;

  todos = todos.filter((t) => t.id !== todoId);

  return res.status(200).json({ id: todoId });
};
