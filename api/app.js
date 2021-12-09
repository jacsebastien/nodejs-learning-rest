require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const headerMiddleware = require("./middleware/header");
const errorMiddleware = require("./middleware/error");
const fileUploadMiddleware = require("./middleware/fileUpload");
const { initWebsocket } = require("./middleware/websockets");

const app = express();

app.use(helmet());
app.use(bodyParser.json()); // application/json
app.use(fileUploadMiddleware); // get the 'image' field and store the file from it
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(headerMiddleware);

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    const server = app.listen(process.env.PORT);
    initWebsocket(server);
  })
  .catch((err) => console.log(err));
