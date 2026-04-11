import Chat from "../models/Chat.js";
// CREATE ONE TO ONE CHAT
const createOneToOne = async (req, res) => {
  try {
    const { userId } = req.body;

    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [req.user.id, userId] },
    });

    if (chat) return res.json(chat);

    chat = await Chat.create({
      isGroup: false,
      participants: [req.user.id, userId],
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE GROUP
const createGroup = async (req, res) => {
  try {
    const { name, participants } = req.body;

    const chat = await Chat.create({
      isGroup: true,
      name,
      participants: [...participants, req.user.id],
      admin: req.user.id,
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MY CHATS
const getMyChats = async (req, res) => {
  const chats = await Chat.find({
    participants: req.user.id,
  })
    .populate("participants", "name avatar")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  res.json(chats);
};

export { createOneToOne, createGroup, getMyChats };
