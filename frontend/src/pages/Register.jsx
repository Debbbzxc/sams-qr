import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({
    idNumber: '', fullName: '', email: '', password: '', confirmPassword: '', role: 'Student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const registrationData = { ...formData };
      delete registrationData.confirmPassword;
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registrationData);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <p className="mb-7 text-center text-slate-500">Create a new account</p>

        {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-sm font-medium text-rose-700">{error}</div>}
        {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <select name="role" value={formData.role} onChange={handleChange} className="field">
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
          <input type="text" name="idNumber" required maxLength="16" placeholder="ID Number" className="field" onChange={handleChange} />
          <input type="text" name="fullName" required maxLength="50" placeholder="Full Name" className="field" onChange={handleChange} />
          <input type="email" name="email" required placeholder="School/Corporate Email" className="field" onChange={handleChange} />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              minLength="8"
              maxLength="32"
              placeholder="Password"
              className="field pr-12"
              onChange={handleChange}
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
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              className="field pr-12"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-emerald-700 focus:outline-none focus:text-emerald-700"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/" className="font-semibold text-primary hover:text-emerald-700">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
