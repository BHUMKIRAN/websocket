// wsServer.js
import { WebSocketServer, WebSocket } from "ws";

// Track online users
const users = new Map();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  // Broadcast online users
  const broadcastUsers = () => {
    const usersArray = [...users.values()];

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "onlineUsers",
            users: usersArray,
          })
        );
      }
    });
  };

  // HEARTBEAT interval (global, not per connection)
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate(); // kill dead connection
      }

      ws.isAlive = false;
      ws.ping(); // send ping
    });
  }, 30000); // every 30 seconds

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.isAlive = true;

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`${data.username} : ${data.message}`);

        // store user if new
        if (!users.has(ws)) {
          users.set(ws, data.username);
          broadcastUsers();
        }

        // broadcast chat
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "chat",
                username: data.username,
                message: data.message,
              })
            );
          }
        });
      } catch (err) {
        console.error("Invalid message format", err);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      users.delete(ws);
      broadcastUsers();
    });
  });

  wss.on("close", () => {
    clearInterval(interval);
  });

  return wss;
};