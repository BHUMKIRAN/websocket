// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  date: String,
  status: String,
});

export default mongoose.model("Attendance", attendanceSchema);