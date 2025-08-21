import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import jobRoutes from "./modules/jobs/job.routes.js";
import messageRoutes from "./modules/messages/message.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";

// Error middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Models (optional if needed for socket events)
import Conversation from "./modules/messages/conversation.model.js";
import Message from "./modules/messages/message.model.js";

dotenv.config();

// ================== EXPRESS + HTTP ==================
const app = express();
const server = http.createServer(app);

// ================== DB CONNECTION ==================
connectDB();

// ================== MIDDLEWARES ==================
app.use(
  cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true })
);
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// ================== PATH SETUP FOR ES MODULES ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads folder exists
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// ✅ Make uploads folder public
app.use("/uploads", express.static("uploads"));


// ================== API ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

// ================== SOCKET.IO ==================
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const onlineUsers = new Map();

// Utility to emit events to a specific user
const emitToUser = (userId, event, payload) => {
  const sid = onlineUsers.get(String(userId));
  if (sid) io.to(sid).emit(event, payload);
};

io.on("connection", (socket) => {
  console.log("✅ socket connected:", socket.id);

  socket.on("user:online", (userId) => {
    socket.data.userId = userId;
    onlineUsers.set(String(userId), socket.id);
    io.emit("presence:update", { userId: String(userId), online: true });
  });

  socket.on("disconnect", () => {
    const uid = socket.data.userId;
    if (uid) {
      onlineUsers.delete(String(uid));
      io.emit("presence:update", { userId: String(uid), online: false });
    }
    console.log("❌ socket disconnected:", socket.id);
  });
});

app.set("io", io);

// ================== SERVER START ==================
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
