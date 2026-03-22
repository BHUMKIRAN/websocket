// models/Teacher.js
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  email: String,
});

export default mongoose.model("Teacher", teacherSchema);