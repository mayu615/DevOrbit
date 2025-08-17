import NodeCache from "node-cache";

// Global job cache (5 min expiry)
export const jobCache = new NodeCache({
  stdTTL: 300,       // 5 min expiry
  checkperiod: 60,   // expired keys cleanup interval
  useClones: false,  // performance better
});

// Clear all cache (future admin panel ke liye)
export const clearJobCache = () => {
  jobCache.flushAll();
  console.log("🧹 Job cache cleared");
};

// Debugging / stats
export const getCacheStats = () => jobCache.getStats();
