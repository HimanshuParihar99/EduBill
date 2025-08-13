import express from "express";
import { registerStudent, login } from "../controllers/auth.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register: only admin can add students
router.post("/register", protect, adminOnly, registerStudent);

// Login for admin & students
router.post("/login", login);

export default router;
