import { Router } from "express";
import protect from "../../middleware/authMiddleware.js";
import { getAllUsers } from "./user.controller.js";

const router = Router();

// GET /api/users -> list all users (protected)
router.get("/", protect, getAllUsers);

export default router;
