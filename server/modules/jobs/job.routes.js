// server/modules/jobs/job.routes.js
import express from "express";
import { getLiveJobs } from "./job.controller.js";
import { clearJobCache, getCacheStats } from "../../utils/cache.js";

const router = express.Router();

// ✅ Real-time Remotive list (no auth)
router.get("/", getLiveJobs);

// 🔐 Simple admin auth (dev-only). Future: proper auth / admin panel.
function requireAdminKey(req, res, next) {
  const key = req.header("x-admin-key");
  if (process.env.ADMIN_KEY && key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// ✅ Manual cache clear
router.post("/admin/cache/clear", requireAdminKey, (req, res) => {
  clearJobCache();
  res.json({ message: "Cache cleared" });
});

// ✅ Optional: cache stats
router.get("/admin/cache/stats", requireAdminKey, (req, res) => {
  res.json(getCacheStats());
});

export default router;
