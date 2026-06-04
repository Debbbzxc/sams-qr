import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier,
        password
      });

      const { token } = response.data;
      localStorage.setItem('sams_token', token);

      const decodedToken = jwtDecode(token);

      if (decodedToken.role === 'Instructor') {
        navigate('/instructor');
      } else if (decodedToken.role === 'Student') {
        navigate('/student');
      }

    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="mb-4 flex justify-center">
          <img
            src="/icon-192.png"
            alt="SAMS Logo"
            className="h-20 w-20 rounded-2xl object-contain shadow-green"
          />
        </div>

        <h2 className="mb-2 text-center text-3xl font-bold text-gradient">SAMS QR</h2>
        <p className="mb-7 text-center text-slate-500">Student Attendance Monitoring System</p>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">ID NUMBER or EMAIL</label>
            <input
              type="text"
              required
              className="field"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 44012345 or student@samsqr.com"
            />
          </div>

          <div>
            <label className="label">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="field pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-emerald-700 focus:outline-none focus:text-emerald-700"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-primary hover:text-emerald-700">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
