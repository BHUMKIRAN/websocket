import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";

import initSocket from "./socket/index.js";
import chatRoutes from "./route/chat.js";
import messageRoutes from "./route/message.js";
import authRoutes from "./route/auth.js";
import friendRoutes from "./route/friendRequest.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS (SECURE)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// ROUTES
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/requests", friendRoutes);

// HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO SERVER
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// INIT SOCKET
initSocket(io);

// ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

// START ONLY AFTER DB CONNECT
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});