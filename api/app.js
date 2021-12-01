const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

// Error handler middleware
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const errors = error.errors || [];
  res.status(statusCode).json({ message, errors });
});

mongoose
  .connect(
    "mongodb+srv://seb:root@nodejscompleterest.shagb.mongodb.net/nodejsRest?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
