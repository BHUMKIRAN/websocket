import express from "express";
import messageController from "../controller/message.js";
import { expressAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", expressAuth, messageController.sendMessage);

router.get("/:chatId", expressAuth, messageController.getMessages);

router.put("/:id", expressAuth, messageController.editMessage);

router.delete("/:id", expressAuth, messageController.deleteMessage);

export default router;
