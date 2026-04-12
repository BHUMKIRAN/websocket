import express from "express";
import friendController from "../controller/friendRequest.js";
import { expressAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", expressAuth, friendController.sendRequest);

router.put("/:id/respond", expressAuth, friendController.respondRequest);

router.get("/", expressAuth, friendController.getMyRequests);

export default router;
