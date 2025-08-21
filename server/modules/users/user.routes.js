import express from "express";
import {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  updateResume,
  getAllUsers,
} from "./user.controller.js";
import protect from "../../middleware/authMiddleware.js";
import { uploadAvatar, uploadResume } from "../../middleware/upload.js";

const router = express.Router();

// ✅ Profile routes
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

// ✅ File uploads
router.put("/me/photo", protect, uploadAvatar.single("avatar"), updateProfilePhoto);
router.put("/me/resume", protect, uploadResume.single("resume"), updateResume);

// ✅ Admin/All Users
router.get("/", protect, getAllUsers);

export default router;
