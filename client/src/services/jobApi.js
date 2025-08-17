const API_URL = import.meta.env.VITE_API_URL;

const request = async (endpoint, method = "GET", body, token) => {
  if (!token) throw new Error("Authentication token is required");

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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

// ✅ Only GET jobs (read-only)
export const getJobs = (page = 1, limit = 20, token) =>
  request(`/jobs?page=${page}&limit=${limit}`, "GET", null, token);
