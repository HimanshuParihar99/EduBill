import express from "express";
import { createAdmin, updateAdmin } from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/admin/create
router.post("/create", createAdmin);

// PATCH /api/admin/update (admin only)
router.patch("/update", protect, adminOnly, updateAdmin);

export default router;
