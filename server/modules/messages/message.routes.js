import { Router } from "express";
import protect from "../../middleware/authMiddleware.js";
import {
  createOrGetConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  seenMessage,
} from "./message.controller.js";

const router = Router();

// create or fetch one-to-one conversation
router.post("/conversation", protect, createOrGetConversation);

// list my conversations
router.get("/conversations", protect, getMyConversations);

// list messages in a conversation
router.get("/:conversationId", protect, getConversationMessages);

// send a message (also emits via socket if available)
router.post("/send", protect, sendMessage);

// mark seen
router.patch("/seen/:messageId", protect, seenMessage);

export default router;
