const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, ""); // safe: remove trailing slash

export const request = async (endpoint, method = "GET", body, token) => {
  const options = { method, headers: {} };

  if (token) options.headers.Authorization = `Bearer ${token}`;
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
};
