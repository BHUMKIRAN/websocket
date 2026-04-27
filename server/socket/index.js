import { socketAuth } from "../middleware/authMiddleware.js";
import messageSocket from "./messageSocket.js";
import typingSocket from "./typingSocket.js";
import presenceSocket from "./presenceSocket.js";

const onlineUsers = new Map();

const initSocket = (io) => {
  // io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    console.log("User connected:", socket.user.name);

    // store online user
    onlineUsers.set(userId, socket.id);

    // join personal room
    socket.join(userId);

    // attach modules
    messageSocket(io, socket, onlineUsers);
    typingSocket(io, socket, onlineUsers);
    presenceSocket(io, socket, onlineUsers);

    // DISCONNECT HANDLING
    socket.on("disconnect", () => {
      console.log("User disconnected");

      onlineUsers.delete(userId);

      socket.broadcast.emit("user:offline", {
        userId,
      });
    });
  });
};

export default initSocket;
