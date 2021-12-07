"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos = [];
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    res.status(200).json({ todos });
});
router.post("/todo", (req, res, next) => {
    const text = req.body.text;
    const newTodo = {
        id: new Date().toISOString(),
        text,
    };
    todos.push(newTodo);
    res.status(200).json({ newTodo });
});
exports.default = router;
