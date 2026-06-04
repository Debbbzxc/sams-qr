import { useNavigate } from 'react-router-dom';
import { clearToken } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/85 text-slate-900 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" alt="SAMS QR" className="h-9 w-9 rounded-xl shadow-sm" />
            <div>
              <div className="font-bold text-lg tracking-tight text-gradient">SAMS QR</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Student Attendance Monitoring System</div>
            </div>
          </div>
          <div>
            <button 
              onClick={handleLogout}
              className="btn-muted"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
