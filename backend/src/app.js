import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import studentRoutes from "./routes/student.route.js";
import feeRoutes from "./routes/fee.route.js";
import reportRoutes from "./routes/report.route.js";
import adminRoutes from "./routes/admin.route.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));



// routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/ping", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running fine 🚀"
  });
});

app.get("/", (req, res) => res.send("Student Fee Backend is alive"));

// error handler (should be last)
app.use(errorHandler);

export default app;
