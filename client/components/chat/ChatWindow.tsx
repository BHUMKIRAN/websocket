"use client";
import { useEffect, useState } from "react";

/**
 * CHAT WINDOW COMPONENT (MAIN CHAT AREA)
 * UI + STRUCTURE IMPLEMENTATION
 */

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "kiran", text: "Hey!", time: "10:00 AM" },
    { id: 2, sender: "other", text: "Hello 👋", time: "10:01 AM" },
  ]);

  const [typing, setTyping] = useState(false);

  // TODO: socket join room
  useEffect(() => {
    // socket.emit("chat:join")
    console.log("Joined chat room");
  }, []);

  return (
    <div className="flex flex-col h-full w-full text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-primary">
        <div className="flex items-center gap-3">
          {/* Back button (mobile) */}
          <button className="md:hidden text-white">←</button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#b07818] flex items-center justify-center">
            C
          </div>

          {/* Chat Info */}
          <div>
            <h2 className="font-semibold text-sm">Chat Room</h2>
            <p className="text-xs text-green-400">● Online</p>
          </div>
        </div>

        {/* Options */}
        <button className="text-white/70">⋮</button>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/50">
            No messages yet
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "kiran" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow
                ${msg.sender === "kiran"
                  ? "bg-background text-black"
                  : "bg-primary text-white"
                }`}
              >
                {msg.text}
                <div className="text-[10px] opacity-60 text-right mt-1">
                  {msg.time}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {typing && (
          <div className="text-xs text-white/60">User is typing...</div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-3 border-t flex items-center gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-full bg-primary text-sm outline-none"
          placeholder="Type a message..."
        />
        <button className="px-4 py-2 bg-[#b07818] text-black rounded-full text-sm">
          Send
        </button>
      </div>
    </div>
  );
}