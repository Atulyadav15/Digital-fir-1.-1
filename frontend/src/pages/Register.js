import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/authService';
import { ErrorMessage } from '../components/UI';

function validate(form) {
  const errs = {};
  if (!form.fullName.trim()) errs.fullName = 'Name is required';
  if (!form.email) errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address';
  if (!form.mobile) errs.mobile = 'Mobile number is required';
  else if (!/^\d{10}$/.test(form.mobile)) errs.mobile = 'Please enter a valid 10-digit mobile number';
  if (!form.password) errs.password = 'Password is required';
  else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
  if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
  return errs;
}

// Defined outside Register so React does not remount it on every render
function Field({ name, label, type = 'text', placeholder, value, error, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-control ${error ? 'error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        autoComplete={type === 'password' ? 'new-password' : 'off'}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setApiError('');
    try {
      const { data } = await registerApi({ fullName: form.fullName, email: form.email, mobile: form.mobile, password: form.password });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <Link to="/" style={s.logo}>🏛️ Digital FIR System</Link>
          <h1 style={s.title}>Create Account</h1>
          <p style={s.sub}>Register to file and track FIRs online</p>
        </div>
        <ErrorMessage message={apiError} />
        <form onSubmit={handleSubmit}>
          <Field name="fullName" label="Full Name" placeholder="Enter your full name" value={form.fullName} error={errors.fullName} onChange={handleChange} />
          <Field name="email" label="Email Address" type="email" placeholder="you@example.com" value={form.email} error={errors.email} onChange={handleChange} />
          <Field name="mobile" label="Mobile Number" placeholder="10-digit mobile number" value={form.mobile} error={errors.mobile} onChange={handleChange} />
          <Field name="password" label="Password" type="password" placeholder="Minimum 6 characters" value={form.password} error={errors.password} onChange={handleChange} />
          <Field name="confirmPassword" label="Confirm Password" type="password" placeholder="Re-enter your password" value={form.confirmPassword} error={errors.confirmPassword} onChange={handleChange} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p style={s.switchText}>Already have an account? <Link to="/login" style={s.switchLink}>Login here</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { textAlign: 'center', marginBottom: 24 },
  logo: { fontSize: 18, fontWeight: 700, color: '#1a56db', display: 'block', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 },
  sub: { fontSize: 14, color: '#6b7280' },
  switchText: { textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 20 },
  switchLink: { color: '#1a56db', fontWeight: 600 },
};
