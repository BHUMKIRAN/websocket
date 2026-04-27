import Chat from "../model/chat.js";
import Message from "../model/message.js";

const messageSocket = (io, socket, onlineUsers) => {
  socket.on("chat:join", (chatId) => {
    socket.join(chatId);
  });

  // SEND MESSAGE
  socket.on("message:send", async (data) => {
    const { chatId, content } = data;

    try {
      const message = await Message.create({
        chat: chatId,
        sender: socket.user.id,
        content,
      });

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
        updatedAt: Date.now(),
      });

      const fullMessage = await Message.findById(message._id).populate(
        "sender",
        "name avatar",
      );

      io.to(chatId).emit("message:new", fullMessage); 
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message:error", { error: "Failed to send message" });
    }
  });

  // EDIT MESSAGE
  socket.on("message:edit", async (data) => {
    const { messageId, newContent } = data;

    const msg = await Message.findById(messageId);
    if (!msg) return;

    if (msg.sender.toString() !== socket.user.id.toString()) return;

    msg.content = newContent;
    msg.edited = true;

    await msg.save();

    io.to(msg.chat.toString()).emit("message:edited", msg);
  });

  // DELETE MESSAGE
  socket.on("message:delete", async (data) => {
    const { messageId } = data;

    const msg = await Message.findById(messageId);
    if (!msg) return;

    if (msg.sender.toString() !== socket.user.id.toString()) return;

    await msg.deleteOne();

    io.to(msg.chat.toString()).emit("message:deleted", {
      messageId,
      chatId: msg.chat,
    });
  });
};

export default messageSocket;
