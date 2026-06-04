import express from 'express';
import Class from '../models/Class.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getManilaDayRange } from '../utils/dateTime.js';

const router = express.Router();

// 1. CREATE A NEW CLASS (Instructor)
router.post('/', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const { subjectName, subjectCode, schedule, room } = req.body;

    const newClass = new Class({
      subjectName,
      subjectCode,
      schedule,
      room,
      instructor: req.user.id,
      enrolledStudents: []
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// *** SPECIFIC ROUTES (NO PARAMETERS) - MUST BE BEFORE :id routes ***

// 2. GET INSTRUCTOR CLASSES
router.get('/instructor', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const classes = await Class.find({ instructor: req.user.id, isArchived: false });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// 2.5 GET ARCHIVED CLASSES (Instructor)
router.get('/instructor/archived', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const classes = await Class.find({ 
      instructor: req.user.id, 
      isArchived: true 
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch archived classes' });
  }
});

// 5. LOG ATTENDANCE (Student QR scan)
router.post('/attend', protect, authorizeRoles('Student'), async (req, res) => {
  try {
    const { classId, sessionId } = req.body;
    const targetClass = await Class.findById(classId);
    if (!targetClass) return res.status(404).json({ message: 'Class not found' });

    if (!targetClass.isActive || targetClass.currentSessionId !== sessionId) {
      return res.status(400).json({ message: 'Invalid or expired QR code' });
    }

    const student = await User.findById(req.user.id);
    const isEnrolled = targetClass.enrolledStudents.some((s) => s.idNumber === student.idNumber);
    if (!isEnrolled) return res.status(403).json({ message: 'Unrecognized: You are not enrolled in this class.' });

    const { start: startOfDay, end: endOfDay } = getManilaDayRange();

    const existingAttendance = await Attendance.findOne({
      classId,
      studentIdNumber: student.idNumber,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'You have already checked in for this class today.' });
    }

    const newAttendance = new Attendance({
      classId, studentIdNumber: student.idNumber, date: new Date(), status: 'Present'
    });
    
    await newAttendance.save();
    res.status(200).json({ message: 'Attendance recorded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// 8. GET STUDENT STATS
router.get('/student/stats', protect, authorizeRoles('Student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const attendances = await Attendance.find({ studentIdNumber: student.idNumber }).populate('classId');
    
    const classStats = {};
    attendances.forEach(record => {
      if (!record.classId || record.classId.isArchived) return; 
      
      const cid = record.classId._id;
      if (!classStats[cid]) {
        classStats[cid] = { classDetails: record.classId, present: 0, absent: 0, history: [] };
      }
      if (record.status === 'Present') classStats[cid].present += 1;
      if (record.status === 'Absent') classStats[cid].absent += 1;
      classStats[cid].history.push({ date: record.date, status: record.status });
    });

    res.json(Object.values(classStats));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student stats' });
  }
});

// *** PARAMETER-BASED ROUTES (:id routes) - COME AFTER specific routes ***

// 3. START CLASS
router.post('/:id/start', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const sessionStr = Math.random().toString(36).substring(2, 10); 
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, {
      isActive: true,
      currentSessionId: sessionStr
    }, { new: true });

    const qrData = JSON.stringify({ classId: updatedClass._id, sessionId: sessionStr });
    res.json({ qrData, message: 'Class started!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error starting class' });
  }
});

// 4. END CLASS
router.post('/:id/end', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    await Class.findByIdAndUpdate(req.params.id, {
      isActive: false,
      currentSessionId: null
    }, { new: true });

    res.json({ message: 'Class ended successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error ending class' });
  }
});

// 6. GET ATTENDANCE SUMMARY
router.get('/:id/attendance', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const targetClass = await Class.findById(req.params.id);
    if (!targetClass) return res.status(404).json({ message: 'Class not found' });

    const attendanceRecords = await Attendance.find({ classId: req.params.id });
    
    const summary = targetClass.enrolledStudents.map(student => {
      const records = attendanceRecords.filter(r => r.studentIdNumber === student.idNumber);
      return {
        ...student._doc,
        presentCount: records.filter(r => r.status === 'Present').length,
        absentCount: records.filter(r => r.status === 'Absent').length,
        history: records
      };
    });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance summary' });
  }
});

// 7. MANUAL ATTENDANCE OVERRIDE
router.post('/:id/attendance/manual', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const { studentIdNumber, status, date } = req.body;
    const attendanceDate = new Date(date);

    if (Number.isNaN(attendanceDate.getTime())) {
      return res.status(400).json({ message: 'Invalid attendance date' });
    }

    const { start: startOfDay, end: endOfDay } = getManilaDayRange(attendanceDate);

    const record = await Attendance.findOneAndUpdate(
      { classId: req.params.id, studentIdNumber, date: { $gte: startOfDay, $lte: endOfDay } },
      { status, date: attendanceDate },
      { new: true, upsert: true } 
    );
    res.json({ message: `Student marked as ${status}`, record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance manually' });
  }
});

// 11. MARK ALL NOT MARKED STUDENTS AS ABSENT FOR TODAY
router.post('/:id/attendance/mark-absent-all', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const targetClass = await Class.findById(req.params.id);
    if (!targetClass) return res.status(404).json({ message: 'Class not found' });

    const { start: startOfDay, end: endOfDay } = getManilaDayRange();

    // Get all attendance records for today
    const todayRecords = await Attendance.find({
      classId: req.params.id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Get student IDs that already have records today
    const markedStudentIds = new Set(todayRecords.map(r => r.studentIdNumber));

    // Find all enrolled students without a record for today
    const notMarkedStudents = targetClass.enrolledStudents.filter(
      student => !markedStudentIds.has(student.idNumber)
    );

    // Create Absent records for all not marked students
    const now = new Date();
    const absentRecords = notMarkedStudents.map(student => ({
      classId: req.params.id,
      studentIdNumber: student.idNumber,
      date: now,
      status: 'Absent'
    }));

    if (absentRecords.length > 0) {
      await Attendance.insertMany(absentRecords);
    }

    res.json({ 
      message: `Successfully marked ${absentRecords.length} student(s) as absent.`,
      count: absentRecords.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark students as absent' });
  }
});

// 9. ARCHIVE A CLASS
router.put('/:id/archive', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id, { isArchived: true }, { new: true }
    );
    res.json({ message: 'Class archived successfully', updatedClass });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive class' });
  }
});

// 10. ENROLL STUDENTS INTO EXISTING CLASS
router.post('/:id/enroll', protect, authorizeRoles('Instructor'), async (req, res) => {
  try {
    const { studentIds } = req.body;
    const targetClass = await Class.findById(req.params.id);

    if (!targetClass) return res.status(404).json({ message: 'Class not found' });

    const students = await User.find({ idNumber: { $in: studentIds }, role: 'Student' });

    let newEnrolls = 0;
    students.forEach(student => {
      const isAlreadyEnrolled = targetClass.enrolledStudents.some(s => s.idNumber === student.idNumber);
      if (!isAlreadyEnrolled) {
        targetClass.enrolledStudents.push({
          idNumber: student.idNumber,
          name: student.fullName
        });
        newEnrolls++;
      }
    });

    await targetClass.save();
    res.json({ message: `Successfully enrolled ${newEnrolls} students.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll students' });
  }
});

export default router;
