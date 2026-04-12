const typingSocket = (io, socket) => {
  socket.on("typing:start", async (chatId) => {
    socket.to(chatId).emit("typing:started", {
      userId: socket.user.id,
      name: socket.user.name,
    });
  });

  socket.on("typing:stop", async (chatId) => {
    socket.to(chatId).emit("typing:stopped", {
      userId: socket.user.id,
    });
  });
};

export default typingSocket;