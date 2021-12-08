import express from "express";

import todosRoute from "./routes/todos";

const app = express();

app.use(express.json());
app.use(todosRoute);

app.listen(3000);
