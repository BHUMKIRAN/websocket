import jwt from "jsonwebtoken";
import User from "../model/user.js";

const authMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // here decoded.id is the user id stored in the token when it was created

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = user; // Attach the user object to the socket for new sockets like {id: '123', user: {id: 'userId', username: 'userName'}}
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next(new Error("Authentication error"));
  }
};
