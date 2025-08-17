import asyncHandler from "../../utils/asyncHandler.js";
import {
  getOrCreateConversation,
  listUserConversations,
  listMessages,
  sendMessageDB,
  markSeen,
} from "./message.service.js";

/**
 * POST /api/messages/conversation
 * body: { otherUserId }
 */
export const createOrGetConversation = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { otherUserId } = req.body;

  if (!userId || !otherUserId) return res.status(400).json({ message: "Missing user IDs" });

  try {
    const convo = await getOrCreateConversation(userId, otherUserId);
    res.status(200).json(convo);
  } catch (err) {
    console.error("createOrGetConversation error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


/**
 * GET /api/messages/conversations?page=&limit=
 */
export const getMyConversations = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { page = 1, limit = 20 } = req.query;
  const data = await listUserConversations(userId, Number(page), Number(limit));
  res.json(data);
});

/**
 * GET /api/messages/:conversationId?page=&limit=
 */
export const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 30 } = req.query;
  const data = await listMessages(conversationId, Number(page), Number(limit));
  res.json(data);
});

/**
 * POST /api/messages/send
 * body: { conversationId, receiverId, text }
 * This will persist in DB and also emit via socket (if available).
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { conversationId, receiverId, text } = req.body;
  if (!conversationId || !receiverId || !text?.trim()) {
    return res.status(400).json({ message: "conversationId, receiverId and text are required" });
  }

  // Persist (no deliveredAt by REST; sockets set deliveredAt)
  const msg = await sendMessageDB({
    conversationId,
    sender: userId,
    receiver: receiverId,
    text: text.trim(),
    delivered: false,
  });

  // emit to room (if io available)
  const io = req.app.get("io");
  if (io) {
    io.to(String(conversationId)).emit("message:receive", msg);
    // also ping receiver socket directly
    const sid = io.sockets.adapter.rooms.get(String(conversationId));
    // send inbox update to receiver separately (if online)
    io.emit("inbox:update", {
      conversationId,
      lastMessage: msg.text,
      lastMessageAt: msg.createdAt,
      from: userId,
    });
  }

  res.status(201).json(msg);
});

/**
 * PATCH /api/messages/seen/:messageId
 */
export const seenMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const updated = await markSeen(messageId);

  // emit seen via io if present
  const io = req.app.get("io");
  if (io && updated) {
    io.to(String(updated.conversation)).emit("message:seen", {
      conversationId: String(updated.conversation),
      messageId: String(updated._id),
      userId: req.user?.userId || req.user?.id || req.user?._id,
      seenAt: updated.seenAt,
    });
  }

  res.json(updated);
});
