"use client"
import React, { useState } from "react";

const mockGroup = {
  name: "Dev Team",
  description: "We build awesome apps 🚀",
  avatar: "",
};

const mockMembers = [
  { id: 1, name: "Kiran", role: "admin", online: true },
  { id: 2, name: "Aayush", role: "member", online: false },
  { id: 3, name: "Sita", role: "member", online: true },
];

export default function GroupChatSettings() {
  const [open, setOpen] = useState(true);
  const [groupName, setGroupName] = useState(mockGroup.name);
  const [groupDesc, setGroupDesc] = useState(mockGroup.description);
  const [isAdmin] = useState(true);
  const [muted, setMuted] = useState(false);

  const [members, setMembers] = useState(mockMembers);

  const removeMember = (id: number) => {
    const ok = confirm("Remove this member?");
    if (!ok) return;
    setMembers(members.filter((m) => m.id !== id));
  };

  const makeAdmin = (id: number) => {
    setMembers(
      members.map((m) =>
        m.id === id ? { ...m, role: "admin" } : m
      )
    );
  };

  const removeAdmin = (id: number) => {
    setMembers(
      members.map((m) =>
        m.id === id ? { ...m, role: "member" } : m
      )
    );
  };

  if (!open) return null;

  return (
    <div className="  ">
      
      {/* MODAL */}
      <div className="w-[500px] max-h-[90vh] overflow-y-auto bg-background text-text rounded-xl shadow-xl border border-gray-200">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b bg-secondary/40">
          <h2 className="text-lg font-bold text-primary">
            Group Settings
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-sm px-2 py-1 rounded bg-secondary hover:opacity-80"
          >
            ✕
          </button>
        </div>

        {/* GROUP INFO */}
        <div className="p-4 space-y-3">
          
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {groupName.charAt(0)}
            </div>

            {isAdmin && (
              <button className="text-sm text-primary underline">
                Change Avatar
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500">Group Name</label>
            <div className="flex gap-2 items-center">
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={!isAdmin}
                className="w-full px-3 py-2 border rounded bg-background"
              />
              {isAdmin && (
                <button className="text-xs bg-primary text-white px-2 py-1 rounded">
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-500">Description</label>
            <textarea
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-3 py-2 border rounded bg-background"
            />
          </div>

          {/* Mute */}
          <div className="flex justify-between items-center bg-secondary/40 p-3 rounded">
            <span className="text-sm">Mute Notifications</span>
            <input
              type="checkbox"
              checked={muted}
              onChange={() => setMuted(!muted)}
            />
          </div>
        </div>

        {/* MEMBERS */}
        <div className="p-4 border-t">
          <h3 className="font-semibold mb-3">Members</h3>

          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 rounded hover:bg-secondary/50"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                    {m.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {m.name}{" "}
                      {m.role === "admin" && (
                        <span className="text-xs text-primary ml-1">
                          (Admin)
                        </span>
                      )}
                    </p>

                    <p className="text-xs text-gray-500">
                      {m.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                {isAdmin && (
                  <div className="flex gap-2">
                    {m.role !== "admin" ? (
                      <button
                        onClick={() => makeAdmin(m.id)}
                        className="text-xs bg-primary text-white px-2 py-1 rounded"
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => removeAdmin(m.id)}
                        className="text-xs bg-secondary px-2 py-1 rounded"
                      >
                        Remove Admin
                      </button>
                    )}

                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t flex justify-between">
          
          {!isAdmin ? (
            <button className="bg-red-500 text-white px-3 py-2 rounded">
              Leave Group
            </button>
          ) : (
            <button className="bg-red-600 text-white px-3 py-2 rounded">
              Delete Group
            </button>
          )}

          <button
            onClick={() => setOpen(false)}
            className="bg-primary text-white px-3 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}