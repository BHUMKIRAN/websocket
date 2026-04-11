import FriendRequest from "../models/FriendRequest.js";

// SEND REQUEST
const sendRequest = async (req, res) => {
  const { to } = req.body;

  const existingRequest = await FriendRequest.findOne({
    from: req.user.id,
    to,
  });

  if (existingRequest) {
    return res.status(400).json({ error: "Friend request already sent" });
  }

  const request = await FriendRequest.create({
    from: req.user.id,
    to,
  });
};

// ACCEPT / REJECT
const respondRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const request = await FriendRequest.findById(id);

  if (!request || request.to.toString() !== req.user.id) {
    return res.status(404).json({ error: "Friend request not found" });
  }

  if (action === "accept") {
    request.status = "accepted";
  } else if (action === "reject") {
    request.status = "rejected";
  } else {
    request.status = "pending";
  }

  await request.save();
};
// GET MY REQUESTS
const getMyRequests = async (req, res) => {
  const requests = await FriendRequest.find({
    to: req.user.id,
    status: "pending",
  }).populate("from", "username");
  res.json(requests);
};

export { sendRequest, respondRequest, getMyRequests };
