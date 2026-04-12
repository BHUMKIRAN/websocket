import FriendRequest from "../model/friendRequest.js";

const sendRequest = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Receiver required" });
    }

    // prevent duplicate request both ways
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: req.user._id, to },
        { from: to, to: req.user._id },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already exists" });
    }

    const request = await FriendRequest.create({
      from: req.user._id,
      to,
    });

    return res.status(201).json({
      message: "Friend request sent",
      request,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const respondRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const request = await FriendRequest.findById(id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // only receiver can respond
    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (action === "accept") {
      request.status = "accepted";
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await request.save();

    return res.json({
      message: `Request ${action}ed`,
      request,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      to: req.user._id,
      status: "pending",
    }).populate("from", "name email avatar");

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  sendRequest,
  respondRequest,
  getMyRequests,
};
