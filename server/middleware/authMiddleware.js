import jwt from "jsonwebtoken";
import User from "../model/user.js";

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return authHeader;
};

export const expressAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Express auth error:", error);
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error("Socket auth error:", error);
    next(new Error("Authentication error"));
  }
};
