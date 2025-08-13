import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student",
    index: true
  },
  contact: {
    type: String,
    trim: true,
    default: null
  },
  class: {
    type: String,
    trim: true,
    default: null
  },
  rollNo: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
