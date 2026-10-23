import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { ErrorMessage } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: '', mobile: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!/^\d{10}$/.test(form.mobile.trim())) return setError('Enter the 10-digit mobile number on your account.');
    if (form.newPassword.length < 10 || form.newPassword.length > 128) return setError('Password must be between 10 and 128 characters.');
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const { data } = await resetPassword({
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        newPassword: form.newPassword
      });
      setSuccess(data.message);
      window.setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || (err.request
        ? 'Cannot reach the server. Make sure the backend is running on port 5001, then try again.'
        : 'Password could not be updated. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Link to="/" style={s.logo}>Civic Desk</Link>
        <h1 style={s.title}>{t('auth.reset.title')}</h1>
        <p style={s.subtitle}>{t('auth.reset.subtitle')}</p>
        <ErrorMessage message={error} />
        {success && <div role="status" style={s.success}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label} htmlFor="reset-email">{t('auth.email')}</label>
          <input id="reset-email" style={s.input} type="email" autoComplete="email" required value={form.email} onChange={e => update('email', e.target.value)} />
          <label style={s.label} htmlFor="reset-mobile">{t('auth.mobile')}</label>
          <input id="reset-mobile" style={s.input} type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} required value={form.mobile} onChange={e => update('mobile', e.target.value.replace(/\D/g, ''))} />
          <label style={s.label} htmlFor="reset-password">{t('auth.newPassword')}</label>
          <input id="reset-password" style={s.input} type="password" autoComplete="new-password" minLength={10} maxLength={128} required value={form.newPassword} onChange={e => update('newPassword', e.target.value)} />
          <label style={s.label} htmlFor="reset-confirm">{t('auth.confirmPassword')}</label>
          <input id="reset-confirm" style={s.input} type="password" autoComplete="new-password" minLength={10} maxLength={128} required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
          <button style={s.button} type="submit" disabled={loading}>{loading ? t('auth.updating') : t('auth.updatePassword')}</button>
        </form>
        <p style={s.back}><Link to="/login">{t('auth.backLogin')}</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #061f49 0%, #092D67 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#fff', borderRadius: 16, padding: '36px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  logo: { display: 'block', textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#1a56db', marginBottom: 24 },
  title: { textAlign: 'center', fontSize: 24, color: '#111827', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#6b7280', fontSize: 14, marginBottom: 24 },
  label: { display: 'block', color: '#374151', fontWeight: 600, fontSize: 14, margin: '14px 0 6px' },
  input: { width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: 8, padding: '12px', fontSize: 15 },
  button: { width: '100%', marginTop: 20, border: 0, borderRadius: 8, background: '#1a56db', color: '#fff', fontWeight: 700, fontSize: 15, padding: 13, cursor: 'pointer' },
  success: { background: '#dcfce7', color: '#166534', borderRadius: 8, padding: 12, fontSize: 14 },
  back: { textAlign: 'center', marginTop: 20, fontSize: 14 }
};
