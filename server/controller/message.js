import Chat from "../model/chat.js";
import Message from "../model/message.js";

const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ error: "chatId and content required" });
    }

    // SECURITY: check if user is part of chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "Not a participant" });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // SECURITY CHECK
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { content } = req.body;

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }

    message.content = content;
    message.edited = true;

    await message.save();

    return res.json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }

    message.deleted = true;
    message.content = "";

    await message.save();

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
};
