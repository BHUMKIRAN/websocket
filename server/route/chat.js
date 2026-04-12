import express from "express";
import { createOneToOne, createGroup, getMyChats } from "../controller/chat.js";
import { expressAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/one-to-one", expressAuth, createOneToOne);

router.post("/group", expressAuth, createGroup);

router.get("/", expressAuth, getMyChats);

export default router;
