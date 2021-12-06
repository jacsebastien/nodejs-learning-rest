exports.initWebsocket = (server) => {
  const socketCors = {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  };
  const io = require("socket.io")(server, socketCors);
  io.on("connection", (socket) => {
    console.log("Client connected");
  });
};
