import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export const registerStudent = async (req, res) => {
  try {
    let { name, email, password, contact, class: className, rollNo } = req.body;
    // Trim and normalize input
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    contact = contact?.trim();
    className = className?.trim();
    rollNo = rollNo?.trim();
    if (!name || !email || !password || !contact || !className || !rollNo) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "student",
      contact,
      class: className,
      rollNo
    });
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        class: user.class,
        rollNo: user.rollNo
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();
    password = password?.trim();
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        class: user.class,
        rollNo: user.rollNo
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
