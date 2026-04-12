import Chat from "../model/chat.js";

const createOneToOne = async (req, res) => {
  try {
    const { userId } = req.body;

    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, userId] },
    });

    if (chat) return res.json(chat);

    chat = await Chat.create({
      isGroup: false,
      participants: [req.user._id, userId],
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, participants } = req.body;

    if (!name || !participants || participants.length < 2) {
      return res.status(400).json({ error: "Invalid group data" });
    }

    const uniqueParticipants = [...new Set(participants)];

    const chat = await Chat.create({
      isGroup: true,
      name,
      participants: [...uniqueParticipants, req.user._id],
      admin: req.user._id,
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "name avatar email")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOneToOne,
  createGroup,
  getMyChats,
};