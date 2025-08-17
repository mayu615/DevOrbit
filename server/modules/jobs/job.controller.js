import asyncHandler from "../../utils/asyncHandler.js";
import fetch from "node-fetch";
import { jobCache } from "../../utils/cache.js";

// Normalize Remotive job shape
const normalize = (j) => ({
  id: j.id,
  title: j.title,
  company: j.company_name || "Unknown",
  location: j.candidate_required_location || "Remote",
  description: j.description || "",
  jobType: j.job_type || "Full-time",
  salaryText: j.salary || null,
  remote: true,
  jobUrl: j.url,
  logoUrl: j.company_logo_url || j.logo_url || null,
  category: j.category || null,
  tags: Array.isArray(j.tags) ? j.tags : [],
  publishedAt: j.publication_date ? new Date(j.publication_date) : null,
  source: "remotive",
});

// GET /api/jobs
export const getLiveJobs = asyncHandler(async (req, res) => {
  const {
    search = "",
    category = "",
    page = 1,
    limit = 20,
  } = req.query;

  const cacheKey = `jobs-${search}-${category}-${page}-${limit}`;

  // 1️⃣ Check cache
  const cached = jobCache.get(cacheKey);
  if (cached) {
    console.log("🚀 Serving from cache:", cacheKey);
    res.set("X-Cache", "HIT");
    return res.json(cached);
  }

  // 2️⃣ Call Remotive API
  const p = new URLSearchParams();
  if (search) p.append("search", search);
  if (category) p.append("category", category);

  const url = `https://remotive.com/api/remote-jobs${p.toString() ? `?${p.toString()}` : ""}`;
  const r = await fetch(url);

  if (!r.ok) {
    return res.status(502).json({ message: `Upstream error: ${r.status}` });
  }

  const data = await r.json();
  const all = Array.isArray(data.jobs) ? data.jobs.map(normalize) : [];
  const total = Number(data["job-count"] ?? all.length);

  // 3️⃣ Pagination
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const slice = all.slice(start, end);

  const responseData = {
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    jobs: slice,
    fromCache: false,
  };

  // 4️⃣ Save to cache
  jobCache.set(cacheKey, responseData);

  res.set("X-Cache", "MISS");
  res.json(responseData);
});

export default { getLiveJobs };
