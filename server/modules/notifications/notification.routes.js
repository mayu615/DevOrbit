import { Router } from "express";
import protect from "../../middleware/authMiddleware.js";
import Notification from "./notification.model.js";

const router = Router();

// Get all notifications for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    // Prevent browser from caching
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean(); // better performance & no mongoose doc overhead

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
});

// Mark a notification as read
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Server error updating notification" });
  }
});

export default router;
