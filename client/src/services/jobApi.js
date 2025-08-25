const API_URL = import.meta.env.VITE_API_URL;

// Generic request function
const request = async (endpoint, method = "GET", body, token) => {
  const options = { method, headers: {} };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
};

// ✅ Jobs fetch — no token required
export const getJobs = (page = 1, limit = 20) =>
  request(`/jobs?page=${page}&limit=${limit}`, "GET");
