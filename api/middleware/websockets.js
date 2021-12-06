const socketIo = require("socket.io");

let io;

function initWebsocket(httpServer) {
  const socketCors = {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  };

  io = socketIo(httpServer, socketCors);
  io.on("connection", (socket) => {
    console.log("Client connected");
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}

module.exports = { initWebsocket, getIo };
