// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
  email: String,
});

export default mongoose.model("Student", studentSchema);