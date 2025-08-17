// modules/messages/message.service.js
import mongoose from "mongoose";
import Conversation from "./conversation.model.js";
import Message from "./message.model.js";

// Helper: Validate and convert to ObjectId
const toObjectId = (id) => {
  if (!id) throw new Error("Invalid ObjectId: " + id);
  return new mongoose.Types.ObjectId(id);
};

/**
 * Create or return existing one-to-one conversation between two users.
 */
export const getOrCreateConversation = async (userA, userB) => {
  try {
    const a = toObjectId(userA);
    const b = toObjectId(userB);

    // Find existing conversation with exactly 2 participants
    let existing = await Conversation.findOne({
      participants: { $all: [a, b], $size: 2 },
    }).populate("participants", "name email avatar role");

    if (existing) return existing;

    // Create new conversation
    const newConvo = await Conversation.create({
      participants: [a, b],
      lastMessage: "",
      lastMessageAt: null,
    });

    return await Conversation.findById(newConvo._id).populate(
      "participants",
      "name email avatar role"
    );
  } catch (err) {
    console.error("getOrCreateConversation error:", err.message);
    throw err;
  }
};

/**
 * List conversations for a user with pagination
 */
export const listUserConversations = async (userId, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const userObjId = toObjectId(userId);

    const [convos, count] = await Promise.all([
      Conversation.find({ participants: userObjId })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("participants", "name email avatar role"),
      Conversation.countDocuments({ participants: userObjId }),
    ]);

    return { convos, count };
  } catch (err) {
    console.error("listUserConversations error:", err.message);
    throw err;
  }
};

/**
 * List messages of a conversation with pagination
 */
export const listMessages = async (conversationId, page = 1, limit = 30) => {
  try {
    const convId = toObjectId(conversationId);
    const skip = (page - 1) * limit;

    const [messages, count] = await Promise.all([
      Message.find({ conversation: convId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments({ conversation: convId }),
    ]);

    return { messages: messages.reverse(), count };
  } catch (err) {
    console.error("listMessages error:", err.message);
    throw err;
  }
};

/**
 * Send a message and update conversation
 */
export const sendMessageDB = async ({ conversationId, sender, receiver, text, delivered = false }) => {
  try {
    const convoId = toObjectId(conversationId);
    const senderId = toObjectId(sender);
    const receiverId = toObjectId(receiver);

    const msg = await Message.create({
      conversation: convoId,
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
      deliveredAt: delivered ? new Date() : null,
    });

    // Update conversation meta
    await Conversation.findByIdAndUpdate(convoId, {
      lastMessage: msg.text,
      lastMessageAt: msg.createdAt,
    });

    return msg;
  } catch (err) {
    console.error("sendMessageDB error:", err.message);
    throw err;
  }
};

/**
 * Mark a message as seen
 */
export const markSeen = async (messageId) => {
  try {
    const msgId = toObjectId(messageId);
    const updated = await Message.findByIdAndUpdate(
      msgId,
      { seenAt: new Date() },
      { new: true }
    );
    return updated;
  } catch (err) {
    console.error("markSeen error:", err.message);
    throw err;
  }
};
