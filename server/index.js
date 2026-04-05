import express from "express";
import http from "http";
import { setupWebSocket } from "./config/websocket.js";

const app = express();
const port = process.env.PORT || 8080;

const server = http.createServer(app);

setupWebSocket(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});