import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authService';
import { ErrorMessage } from '../components/UI';

function validate(form) {
  const errs = {};
  if (!form.email) errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address';
  if (!form.password) errs.password = 'Password is required';
  return errs;
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setApiError('');
    try {
      const { data } = await loginApi({ email: form.email, password: form.password });
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <Link to="/" style={s.logo}>🏛️ Digital FIR System</Link>
          <h1 style={s.title}>Welcome Back</h1>
          <p style={s.sub}>Sign in to your account</p>
        </div>

        <ErrorMessage message={apiError} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className={`form-control ${errors.email ? 'error' : ''}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className={`form-control ${errors.password ? 'error' : ''}`} type="password" placeholder="Enter your password" value={form.password} onChange={e => set('password', e.target.value)} />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div style={s.row}>
            <label style={s.check}><input type="checkbox" checked={form.remember} onChange={e => set('remember', e.target.checked)} /> Remember me</label>
            <Link to="/forgot-password" style={s.forgot}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div style={s.divider}><span>or</span></div>
        <p style={s.switchText}>Don't have an account? <Link to="/register" style={s.switchLink}>Create an account</Link></p>

        <div style={s.demo}>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Demo Credentials:</p>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Admin: admin@digitalfir.gov / password</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { textAlign: 'center', marginBottom: 28 },
  logo: { fontSize: 18, fontWeight: 700, color: '#1a56db', display: 'block', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 },
  sub: { fontSize: 14, color: '#6b7280' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  check: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', cursor: 'pointer' },
  forgot: { fontSize: 13, color: '#1a56db' },
  divider: { textAlign: 'center', margin: '20px 0', position: 'relative', color: '#9ca3af', fontSize: 13 },
  switchText: { textAlign: 'center', fontSize: 14, color: '#6b7280' },
  switchLink: { color: '#1a56db', fontWeight: 600 },
  demo: { marginTop: 20, padding: '12px', background: '#f9fafb', borderRadius: 8, textAlign: 'center' },
};
