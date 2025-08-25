import { request } from "./request";

// Auth
export const loginUser = (email, password) =>
  request("/auth/login", "POST", { email, password });

export const registerUser = (userData) =>
  request("/auth/register", "POST", userData);

export const getMe = (token) =>
  request("/auth/me", "GET", null, token);

// Jobs
export const getJobs = (page = 1, limit = 20) =>
  request(`/jobs?page=${page}&limit=${limit}`, "GET");
