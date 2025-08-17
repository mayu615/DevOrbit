import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import jobRoutes from "./modules/jobs/job.routes.js";
import messageRoutes from "./modules/messages/message.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";

// Error middleware (named imports)
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Models
import Conversation from "./modules/messages/conversation.model.js";
import Message from "./modules/messages/message.model.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// REST Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const onlineUsers = new Map();

// utility: emit to a user if online
const emitToUser = (userId, event, payload) => {
  const sid = onlineUsers.get(String(userId));
  if (sid) io.to(sid).emit(event, payload);
};

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("user:online", async ({ userId }) => {
    try {
      if (!userId) return;
      onlineUsers.set(String(userId), socket.id);
      socket.data.userId = String(userId);

      // auto-join user conversations
      const convos = await Conversation.find({
        participants: mongoose.Types.ObjectId(userId),
      }).select("_id");

      if (convos?.length) {
        convos.forEach((c) => socket.join(String(c._id)));
      }

      io.emit("presence:update", { userId: String(userId), online: true });
    } catch (e) {
      console.warn("user:online error:", e.message);
    }
  });

  socket.on("conversation:join", ({ conversationId, userId }) => {
    if (!conversationId) return;
    socket.join(String(conversationId));
    io.to(String(conversationId)).emit("conversation:presence", {
      conversationId,
      userId: String(userId || socket.data.userId),
      joined: true,
    });
  });

  socket.on("message:typing", ({ conversationId, userId, typing }) => {
    if (!conversationId) return;
    socket.to(String(conversationId)).emit("message:typing", {
      conversationId,
      userId: String(userId || socket.data.userId),
      typing: Boolean(typing),
    });
  });

  socket.on(
    "message:send",
    async ({ conversationId, senderId, receiverId, text }) => {
      try {
        if (!conversationId || !senderId || !receiverId || !text?.trim()) return;

        const convo = await Conversation.findById(conversationId);
        if (!convo) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          receiver: receiverId,
          text: text.trim(),
          deliveredAt: new Date(),
        });

        convo.lastMessage = message.text;
        convo.lastMessageAt = message.createdAt;
        await convo.save();

        io.to(String(conversationId)).emit("message:receive", message);

        emitToUser(receiverId, "inbox:update", {
          conversationId,
          lastMessage: message.text,
          lastMessageAt: message.createdAt,
          from: senderId,
        });
      } catch (err) {
        console.error("message:send error:", err.message);
        socket.emit("error", { message: "Unable to send message" });
      }
    }
  );

  socket.on("message:seen", async ({ conversationId, messageId, userId }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;
      msg.seenAt = new Date();
      await msg.save();

      io.to(String(conversationId)).emit("message:seen", {
        conversationId,
        messageId,
        userId: String(userId || socket.data.userId),
        seenAt: msg.seenAt,
      });

      emitToUser(msg.sender, "message:seen:notify", {
        conversationId,
        messageId,
        seenBy: String(userId || socket.data.userId),
        seenAt: msg.seenAt,
      });
    } catch (e) {
      console.error("message:seen error:", e.message);
    }
  });

  socket.on("disconnect", () => {
    const uid = socket.data.userId;
    if (uid) {
      onlineUsers.delete(String(uid));
      io.emit("presence:update", { userId: String(uid), online: false });
    }
    console.log("socket disconnected:", socket.id);
  });
});

app.set("io", io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
