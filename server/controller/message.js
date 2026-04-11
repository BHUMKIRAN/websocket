import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MESSAGES
const getMessages = async (req, res) => {
  const messages = await Message.find({
    chat: req.params.chatId,
  })
    .populate("sender", "name avatar")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(messages);
};

// EDIT MESSAGE
const editMessage = async (req, res) => {
  try {
    const { content } = req.body;

    const message = await Message.findById(req.params.id);

    if (message.sender.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    message.content = content;
    message.edited = true;

    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE MESSAGE
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message.sender.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    message.deleted = true;
    message.content = "";

    await message.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { sendMessage, getMessages, editMessage, deleteMessage };
