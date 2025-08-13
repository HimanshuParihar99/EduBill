import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// PATCH /api/admin/update (authenticated admin only)
export const updateAdmin = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        if (!adminId || req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
        const { name, contact, password } = req.body;
        const updates = {};
        if (name) updates.name = name.trim();
        if (contact) updates.contact = contact.trim();
        if (password) updates.password = await bcrypt.hash(password.trim(), 10);
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No update fields provided" });
        }
        const updatedAdmin = await User.findByIdAndUpdate(adminId, updates, { new: true }).select("-password");
        res.json({ message: "Admin updated", admin: updatedAdmin });
    } catch (err) {
        next(err);
    }
};
// POST /api/admin/create
export const createAdmin = async (req, res, next) => {
    try {
        const { email, password, name, contact } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "email, password, and name are required" });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Admin user already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const admin = await User.create({
            name,
            email,
            password: hashed,
            role: "admin",
            contact: contact || "",
        });
        res.status(201).json({ message: "Admin user created", admin: { id: admin._id, email: admin.email, name: admin.name } });
    } catch (err) {
        next(err);
    }
};