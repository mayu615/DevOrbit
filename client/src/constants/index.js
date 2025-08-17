// src/constants/index.js

// Backend API base URL
export const API_BASE_URL =
 "/api";

// User roles
export const USER_ROLES = {
  DEVELOPER: "developer",
  RECRUITER: "recruiter",
};

// Job categories (future filter use के लिए)
export const JOB_CATEGORIES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile App Developer",
  "Data Scientist",
  "AI/ML Engineer",
  "Other",
];

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

// Common messages (error/success)
export const MESSAGES = {
  LOGIN_REQUIRED: "You must be logged in to access this page.",
  FORBIDDEN: "You do not have permission to view this page.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
};

// Date format for UI
export const DATE_FORMAT = "DD MMM YYYY";
