import { useCallback, useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import ManilaNowCard from '../components/ManilaNowCard';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import { getUserFromToken } from '../utils/auth';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/classes`;

const StudentDashboard = () => {
  const user = getUserFromToken();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({ type: '', message: '' });
  const [stats, setStats] = useState([]);
  const scannerRef = useRef(null);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('sams_token');
      const response = await axios.get(`${API_URL}/student/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  }, []);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      fetchStats();
    }, 0);

    return () => {
      clearTimeout(loadTimer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error).then(() => {
          scannerRef.current.clear();
        });
      }
    };
  }, [fetchStats]);

  const onScanSuccess = useCallback(async (decodedText) => {
    await stopScanner();
    setScanResult({ type: 'info', message: 'Processing QR Code...' });

    try {
      const qrData = JSON.parse(decodedText);
      const token = localStorage.getItem('sams_token');
      const response = await axios.post(`${API_URL}/attend`, qrData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setScanResult({ type: 'success', message: response.data.message });
      fetchStats();
    } catch (error) {
      setScanResult({ type: 'error', message: error.response?.data?.message || 'Invalid QR Code' });
    }
  }, [fetchStats]);

  const startScanner = () => {
    setIsScanning(true);
    setScanResult({ type: '', message: '' });

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          () => {}
        );
      } catch {
        setScanResult({ type: 'error', message: 'Failed to access camera. Please check permissions.' });
        setIsScanning(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="app-page">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Student Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Hi, <span className="text-emerald-600 drop-shadow-lg">{user?.name || 'Student'}</span>!
          </h1>
        </div>

        <div className="mb-6">
          <ManilaNowCard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="panel panel-pad h-fit">
            <h2 className="mb-6 text-center text-lg font-semibold text-slate-950">Attendance Scanner</h2>

            {scanResult.message && (
              <div className={`mb-6 rounded-xl border p-4 text-center text-sm font-semibold ${
                scanResult.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                scanResult.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' :
                'border-teal-200 bg-teal-50 text-teal-700'
              }`}>
                {scanResult.message}
              </div>
            )}

            {!isScanning ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-white px-5 py-10 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-primary shadow-sm ring-1 ring-emerald-100">
                  QR
                </div>
                <button
                  onClick={startScanner}
                  className="btn-primary w-full max-w-xs"
                >
                  Start Scanning
                </button>
                <p className="mt-4 text-sm text-slate-500">Tap to open your camera</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative mb-6 w-full overflow-hidden rounded-2xl border border-emerald-200 bg-slate-950 shadow-green">
                  <div id="qr-reader" className="min-h-[250px] w-full"></div>
                </div>
                <button
                  onClick={stopScanner}
                  className="btn-danger w-full max-w-xs py-3"
                >
                  Stop Scanning
                </button>
              </div>
            )}
          </div>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-950">My Attendance Overview</h2>
            {stats.length === 0 ? (
              <p className="panel panel-pad text-sm text-slate-500">No attendance records yet.</p>
            ) : (
              <div className="space-y-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="panel panel-pad flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{stat.classDetails.subjectName}</h3>
                      <p className="mt-1 text-sm text-slate-500">{stat.classDetails.subjectCode}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Present</p>
                        <p className="text-2xl font-bold text-emerald-700">{stat.present}</p>
                      </div>
                      <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-600">Absent</p>
                        <p className="text-2xl font-bold text-rose-700">{stat.absent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
