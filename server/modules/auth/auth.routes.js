import { Router } from "express";
import authController from "./auth.controller.js";
import validate from "../../middleware/validation.middleware.js";
import { registerValidation, loginValidation } from "./auth.validation.js";
import protect from "../../middleware/authMiddleware.js"; 

const router = Router();

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);
router.get("/me", protect, authController.getMe);

export default router;
