import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  studentIdNumber: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);