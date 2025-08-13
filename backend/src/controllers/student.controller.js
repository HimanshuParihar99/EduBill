import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    console.error("Get all students error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error("Get student error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const student = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
