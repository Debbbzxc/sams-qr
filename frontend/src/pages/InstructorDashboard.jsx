import { useCallback, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ManilaNowCard from '../components/ManilaNowCard';
import axios from 'axios';
import QRCode from 'qrcode';
import { getUserFromToken } from '../utils/auth';
import { getCurrentManilaDateKey, getManilaDateKey } from '../utils/datetime';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/classes`;

const InstructorDashboard = () => {
  const user = getUserFromToken();
  const [classes, setClasses] = useState([]);
  const [archivedClasses, setArchivedClasses] = useState([]);
  const [activeQrImage, setActiveQrImage] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [newClassData, setNewClassData] = useState({
    subjectName: '', subjectCode: '', schedule: '', room: ''
  });
  const [enrollIdsText, setEnrollIdsText] = useState('');

  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem('sams_token');
      const response = await axios.get(`${API_URL}/instructor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes', error);
    }
  }, []);

  const fetchArchivedClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem('sams_token');
      const response = await axios.get(`${API_URL}/instructor/archived`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArchivedClasses(response.data);
    } catch (error) {
      console.error('Error fetching archived classes', error);
    }
  }, []);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      fetchClasses();
      fetchArchivedClasses();
    }, 0);

    return () => clearTimeout(loadTimer);
  }, [fetchClasses, fetchArchivedClasses]);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sams_token');
      await axios.post(API_URL, newClassData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewClassData({ subjectName: '', subjectCode: '', schedule: '', room: '' });
      fetchClasses();
    } catch {
      alert('Failed to create class');
    }
  };

  const startClass = async (classId) => {
    try {
      const token = localStorage.getItem('sams_token');
      const response = await axios.post(`${API_URL}/${classId}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const qrImageUrl = await QRCode.toDataURL(response.data.qrData, { width: 300 });
      setActiveQrImage(qrImageUrl);
      fetchClasses();
    } catch {
      alert('Failed to start class');
    }
  };

  const endClass = async (classId) => {
    try {
      const token = localStorage.getItem('sams_token');
      await axios.post(`${API_URL}/${classId}/end`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveQrImage(null);
      fetchClasses();
    } catch {
      alert('Failed to end class');
    }
  };

  const archiveClass = async (classId) => {
    if (!window.confirm('Are you sure you want to archive this class?')) return;
    try {
      const token = localStorage.getItem('sams_token');
      await axios.put(`${API_URL}/${classId}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClasses();
      fetchArchivedClasses();
      if (selectedClass?._id === classId) setSelectedClass(null);
    } catch {
      alert('Failed to archive class');
    }
  };

  const viewAttendance = async (cls) => {
    setSelectedClass(cls);
    try {
      const token = localStorage.getItem('sams_token');
      const response = await axios.get(`${API_URL}/${cls._id}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceData(response.data);
    } catch {
      alert('Failed to fetch attendance');
    }
  };

  const handleEnrollStudents = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sams_token');
      const studentIds = enrollIdsText.split('\n').map(id => id.trim()).filter(id => id !== '');
      const response = await axios.post(`${API_URL}/${selectedClass._id}/enroll`, { studentIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
      setEnrollIdsText('');
      viewAttendance(selectedClass);
    } catch {
      alert('Failed to enroll students');
    }
  };

  const manualOverride = async (studentIdNumber, status) => {
    try {
      const token = localStorage.getItem('sams_token');
      await axios.post(`${API_URL}/${selectedClass._id}/attendance/manual`,
      { studentIdNumber, status, date: new Date() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      viewAttendance(selectedClass);
    } catch {
      alert('Failed to update attendance manually');
    }
  };

  const markAllAbsent = async () => {
    if (!window.confirm('Are you sure you want to mark all "Not Marked" students as Absent for today?')) return;
    try {
      const token = localStorage.getItem('sams_token');
      const response = await axios.post(`${API_URL}/${selectedClass._id}/attendance/mark-absent-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
      viewAttendance(selectedClass);
    } catch {
      alert('Failed to mark students as absent');
    }
  };

  const downloadCSV = () => {
    if (attendanceData.length === 0) return alert('No attendance data to export.');
    
    // Extract and sort unique dates from attendance history (in Manila timezone)
    const dateSet = new Set();
    attendanceData.forEach(student => {
      if (student.history) {
        student.history.forEach(record => {
          dateSet.add(getManilaDateKey(record.date));
        });
      }
    });
    
    const sortedDates = Array.from(dateSet).sort();
    
    // Format dates as "MMM DD"
    const formatDateColumn = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(year, parseInt(month) - 1, day);
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };
    
    // Build CSV header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student Name,ID Number,Total Present,Total Absent";
    sortedDates.forEach(date => {
      csvContent += `,${formatDateColumn(date)}`;
    });
    csvContent += "\n";
    
    // Build CSV rows
    attendanceData.forEach(student => {
      csvContent += `${student.name},${student.idNumber},${student.presentCount},${student.absentCount}`;
      
      sortedDates.forEach(dateStr => {
        const record = student.history?.find(h => getManilaDateKey(h.date) === dateStr);
        if (record) {
          csvContent += `,${record.status === 'Present' ? 'P' : 'A'}`;
        } else {
          csvContent += ",";
        }
      });
      csvContent += "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedClass.subjectCode}_Attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTodayStatus = (history) => {
    if (!history || history.length === 0) return 'Not Marked';
    const today = getCurrentManilaDateKey();
    const todayRecord = history.find((record) => getManilaDateKey(record.date) === today);
    return todayRecord ? todayRecord.status : 'Not Marked';
  };

  return (
    <div className="app-page">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Instructor Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Hi, <span className="text-emerald-600 drop-shadow-lg">{user?.name || 'Instructor'}</span>!
          </h1>
        </div>

        <div className="mb-6">
          <ManilaNowCard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="panel panel-pad">
              <h2 className="mb-4 text-lg font-semibold text-slate-950">Create New Class</h2>
              <form onSubmit={handleCreateClass} className="grid grid-cols-1 gap-3">
                <input type="text" placeholder="Subject Name" required value={newClassData.subjectName} onChange={(e) => setNewClassData({...newClassData, subjectName: e.target.value})} className="field" />
                <input type="text" placeholder="Code" required value={newClassData.subjectCode} onChange={(e) => setNewClassData({...newClassData, subjectCode: e.target.value})} className="field" />
                <input type="text" placeholder="Schedule (e.g. 7:30AM - 9:30AM MTh)" required value={newClassData.schedule} onChange={(e) => setNewClassData({...newClassData, schedule: e.target.value})} className="field" />
                <input type="text" placeholder="Room" required value={newClassData.room} onChange={(e) => setNewClassData({...newClassData, room: e.target.value})} className="field" />
                <button type="submit" className="btn-primary">Add Class</button>
              </form>
            </div>

            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-950">Your Active Classes</h2>
              {classes.length === 0 ? (
                <p className="panel panel-pad text-sm text-slate-500">No active classes.</p>
              ) : (
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div key={cls._id} className="panel panel-pad">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-950">{cls.subjectName}</h3>
                          <p className="mt-1 text-sm text-slate-500">{cls.subjectCode} | {cls.schedule}</p>
                        </div>
                        {cls.isActive && <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">Live</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        {cls.isActive ? (
                          <button onClick={() => endClass(cls._id)} className="btn-danger">End Class</button>
                        ) : (
                          <button onClick={() => startClass(cls._id)} className="btn-primary">Start Class</button>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => viewAttendance(cls)} className="btn-muted">Manage</button>
                          <button onClick={() => archiveClass(cls._id)} className="btn-muted">Archive</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="border-t border-slate-200 pt-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-700">Archived Classes</h2>
              {archivedClasses.length === 0 ? (
                <p className="text-sm italic text-slate-400">No archived records.</p>
              ) : (
                <div className="space-y-3">
                  {archivedClasses.map((cls) => (
                    <div key={cls._id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <h3 className="font-semibold text-slate-700">{cls.subjectName}</h3>
                      <p className="text-xs text-slate-500">{cls.subjectCode} | {cls.schedule}</p>
                      <button
                        onClick={() => viewAttendance(cls)}
                        className="mt-3 text-sm font-semibold text-primary hover:text-emerald-700"
                      >
                        View Attendance
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="panel panel-pad flex min-h-[300px] flex-col items-center justify-center text-center">
              <h2 className="mb-4 text-lg font-semibold text-slate-950">Active QR Session</h2>
              {activeQrImage ? (
                <div>
                  <img src={activeQrImage} alt="QR Code" className="mx-auto mb-3 rounded-2xl border border-emerald-200 bg-white p-3 shadow-green" />
                  <p className="text-sm font-semibold text-emerald-700">Scanning is active.</p>
                </div>
              ) : (
                <p className="max-w-sm text-sm text-slate-500">Start a class to generate a QR code for attendance.</p>
              )}
            </div>

            {selectedClass && (
              <div className="panel panel-pad">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Manage</p>
                    <h2 className="text-xl font-semibold text-slate-950">{selectedClass.subjectName}</h2>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {!selectedClass.isArchived && (
                      <button onClick={markAllAbsent} className="btn-danger px-4 py-2.5">Mark Absent (Auto)</button>
                    )}
                    <button onClick={downloadCSV} className="btn-primary px-4 py-2.5">Export Attendance</button>
                  </div>
                </div>

                {!selectedClass.isArchived && (
                  <form onSubmit={handleEnrollStudents} className="mb-6 flex flex-col gap-3 md:flex-row">
                    <textarea
                      placeholder="Add Students: Enter Student IDs, one per line..."
                      value={enrollIdsText}
                      onChange={(e) => setEnrollIdsText(e.target.value)}
                      className="field min-h-[86px] flex-1 resize-none"
                      rows="2"
                      required
                    />
                    <button type="submit" className="btn-primary md:self-stretch">Add Students</button>
                  </form>
                )}

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 font-semibold text-slate-600">Student</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                        <th className="px-4 py-3 text-center font-semibold text-slate-600">Status</th>
                        <th className="px-4 py-3 text-center font-semibold text-slate-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {attendanceData.length === 0 ? (
                         <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No student records.</td></tr>
                      ) : (
                        attendanceData.map((student, idx) => {
                          const currentStatus = getTodayStatus(student.history);

                          return (
                            <tr key={idx}>
                              <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                              <td className="px-4 py-3 text-slate-500">{student.idNumber}</td>
                              <td className="px-4 py-3 text-center">
                                {currentStatus === 'Present' && <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">Present</span>}
                                {currentStatus === 'Absent' && <span className="badge bg-rose-50 text-rose-700 ring-1 ring-rose-100">Absent</span>}
                                {currentStatus === 'Not Marked' && <span className="badge bg-slate-100 text-slate-500">Not Marked</span>}
                              </td>

                              <td className="px-4 py-3">
                                {!selectedClass.isArchived ? (
                                  <div className="flex justify-center gap-2">
                                    <button onClick={() => manualOverride(student.idNumber, 'Present')} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">Mark Present</button>
                                    <button onClick={() => manualOverride(student.idNumber, 'Absent')} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50">Mark Absent</button>
                                  </div>
                                ) : (
                                  <span className="block text-center text-xs font-medium italic text-slate-400">Record Finalized</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
