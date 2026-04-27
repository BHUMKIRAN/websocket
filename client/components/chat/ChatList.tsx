"use client";
import React, { useState } from "react";

const Friends = [
  {
    id: 1,
    name: "Friend 1",
    img: "",
    lastMessage: "Hey, how are you?",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: 2,
    name: "Friend 2",
    img: "",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    name: "Friend 3",
    img: "",
    lastMessage: "Typing...",
    time: "1h ago",
    unread: 5,
  },
];

const ChatList = () => {
  const [search, setSearch] = useState("");
  const [activeChat, setActiveChat] = useState(null);

  const filteredChats = Friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[380px] h-screen w-full  flex flex-col border-r border-gray-200 bg-secondary text-text">
      
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 bg-secondary/40">
        <h1 className="text-xl font-bold text-primary">Chats</h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-3 px-3 py-2 rounded-md bg-background border border-gray-300 text-text outline-none focus:ring-2 focus:ring-primary"
        />

        {/* ACTIONS */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-primary text-white py-2 rounded-md text-sm hover:opacity-90 transition">
            + New Chat
          </button>
          <button className="flex-1 bg-secondary text-text py-2 rounded-md text-sm hover:opacity-80 transition">
            + Group
          </button>
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No chats found
          </div>
        ) : (
          filteredChats.map((f) => (
            <div
              key={f.id}
              onClick={() => setActiveChat(f.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition border-b border-gray-100 hover:bg-secondary/60 ${
                activeChat === f.id ? "bg-secondary" : ""
              }`}
            >
              {/* AVATAR */}
              <div className="relative">
                {f.img ? (
                  <img
                    src={f.img}
                    alt={f.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {f.name.charAt(0)}
                  </div>
                )}

                {/* online dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
              </div>

              {/* CHAT INFO */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-sm">{f.name}</h2>
                  <span className="text-xs text-gray-500">{f.time}</span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 truncate w-[180px]">
                    {f.lastMessage}
                  </p>

                  {f.unread > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      {f.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;