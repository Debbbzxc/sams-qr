import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  schedule: { type: String, required: true }, // e.g., "Mon/Wed 10:00 AM"
  room: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isArchived: { type: Boolean, default: false },
  enrolledStudents: [{
    idNumber: { type: String, required: true },
    name: { type: String, required: true }
  }],
  // For QR generation and active sessions
  isActive: { type: Boolean, default: false }, 
  currentSessionId: { type: String, default: null } 
}, { timestamps: true });

export default mongoose.model('Class', classSchema);