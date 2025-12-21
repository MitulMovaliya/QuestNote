import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import messageController from "../controllers/message.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/chat/:noteId", messageController.messageConversation);
router.get("/chat/:noteId/history", messageController.getAllMessages);

router.get("/test/embeddings/:noteId", messageController.testingEmbeddings);

export default router;
