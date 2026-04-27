"use client";

import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

export default function Page() {
  const [status, setStatus] = useState("Connecting...");
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    // const socket = io(SOCKET_URL, {
    //   auth: token ? { token } : undefined,
    //   transports: ["websocket"],
    // });
    const socket = io(SOCKET_URL);
    socket.on("connect", () => {
      setStatus("Connected");
      setSocketId(socket.id ?? null);
      console.log("Connected to server", socket.id);
    });

    socket.on("connect_error", (error) => {
      setStatus(`Connection failed: ${error.message}`);
      console.error("Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      setStatus(`Disconnected: ${reason}`);
      setSocketId(null);
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Socket.IO connection test</h1>
      <p className="mt-4">Status: {status}</p>
      <p className="mt-2">Socket ID: {socketId ?? "Not connected"}</p>
    </main>
  );
}
