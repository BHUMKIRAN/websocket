import User from "../model/user.js";

const presenceSocket = (io, socket) => {
  // USER ONLINE
  User.findByIdAndUpdate(socket.user._id, {
    status: "online",
  }).exec();

  socket.broadcast.emit("user:online", {
    userId: socket.user._id,
  });

  // USER OFFLINE
  socket.on("disconnect", async () => {
    await User.findByIdAndUpdate(socket.user._id, {
      status: "offline",
      lastSeen: new Date(),
    });

    socket.broadcast.emit("user:offline", {
      userId: socket.user._id,
      lastSeen: new Date(),
    });
  });
};

export default presenceSocket;
