import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/authService';
import { ErrorMessage } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';

function validate(form) {
  const errs = {};
  if (!form.fullName.trim()) errs.fullName = 'Name is required';
  if (!form.email) errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address';
  if (!form.mobile) errs.mobile = 'Mobile number is required';
  else if (!/^\d{10}$/.test(form.mobile)) errs.mobile = 'Please enter a valid 10-digit mobile number';
  if (!form.password) errs.password = 'Password is required';
  else if (form.password.length < 10 || form.password.length > 128) errs.password = 'Password must be between 10 and 128 characters';
  if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
  return errs;
}

// Defined outside Register so React does not remount it on every render
function Field({ name, label, type = 'text', placeholder, value, error, onChange }) {
  const id = `register-${name}`;
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input
        id={id}
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
  const { t } = useLanguage();
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
      setApiError(err.response?.data?.message || (err.request
        ? 'Cannot reach the server. Make sure the backend is running on port 5001, then try again.'
        : 'Registration failed. Please try again.'));
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <Link to="/" style={s.logo}>🏛️ Digital FIR System</Link>
          <h1 style={s.title}>{t('auth.registerTitle')}</h1>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 9 }}>Not an official FIR filing portal · Use fictional information only</p>
          <p style={s.sub}>{t('auth.registerSub')}</p>
        </div>
        <ErrorMessage message={apiError} />
        <form onSubmit={handleSubmit}>
          <Field name="fullName" label={t('auth.fullName')} placeholder="Enter your full name" value={form.fullName} error={errors.fullName} onChange={handleChange} />
          <Field name="email" label={t('auth.email')} type="email" placeholder="you@example.com" value={form.email} error={errors.email} onChange={handleChange} />
          <Field name="mobile" label={t('auth.mobileShort')} placeholder="10-digit mobile number" value={form.mobile} error={errors.mobile} onChange={handleChange} />
          <Field name="password" label={t('auth.password')} type="password" placeholder="10 to 128 characters" value={form.password} error={errors.password} onChange={handleChange} />
          <Field name="confirmPassword" label={t('auth.confirmPassword')} type="password" placeholder="Re-enter your password" value={form.confirmPassword} error={errors.confirmPassword} onChange={handleChange} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
            {loading ? t('auth.registering') : t('auth.registerTitle')}
          </button>
        </form>
        <p style={s.switchText}>Already have an account? <Link to="/login" style={s.switchLink}>Login here</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #061f49 0%, #092D67 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { textAlign: 'center', marginBottom: 24 },
  logo: { fontSize: 18, fontWeight: 700, color: '#092D67', display: 'block', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 },
  sub: { fontSize: 14, color: '#6b7280' },
  switchText: { textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 20 },
  switchLink: { color: '#1a56db', fontWeight: 600 },
};
