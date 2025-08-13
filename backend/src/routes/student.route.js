import express from "express";
import { getAllStudents, getStudent, updateStudent, deleteStudent } from "../controllers/student.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", adminOnly, getAllStudents);
router.get("/:id", adminOnly, getStudent);
router.put("/:id", adminOnly, updateStudent);
router.delete("/:id", adminOnly, deleteStudent);

export default router;
