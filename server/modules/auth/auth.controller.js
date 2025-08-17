import authService from "./auth.service.js";  // Correct default import
import asyncHandler from "../../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: user.token || undefined, // optional if service returns token
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  const tokenData = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: "Login successful",
    token: tokenData.token,
    user: tokenData.user,
  });
});

const getMe = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  res.status(200).json({ success: true, user: req.user });
});

export default {
  register,
  login,
  getMe, // FIXED: proper case
};
