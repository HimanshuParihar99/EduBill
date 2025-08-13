import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

import User from "./src/models/user.model.js";
import bcrypt from "bcryptjs";

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    // Auto-create admin if not exists
    let adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    let adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    let adminName = process.env.ADMIN_NAME || "Admin";
    let adminContact = process.env.ADMIN_CONTACT || "";
    adminEmail = adminEmail.trim().toLowerCase();
    adminPassword = adminPassword.trim();
    adminName = adminName.trim();
    adminContact = adminContact.trim();
    const existingAdmin = await User.findOne({ email: adminEmail, role: "admin" });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashed,
        role: "admin",
        contact: adminContact,
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Admin user exists: ${adminEmail}`);
    }
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

startServer();
