import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Loading, ErrorMessage, SuccessMessage } from '../components/UI';
import { getProfile, updateProfile, changePassword } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [form, setForm] = useState({});
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  useEffect(() => {
    getProfile().then(r => { setProfile(r.data); setForm({ fullName: r.data.fullName, mobile: r.data.mobile, address: r.data.address || '' }); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError(''); setSuccess('');
    try {
      const { data } = await updateProfile(form);
      setProfile(data);
      setEditing(false);
      setSuccess('Profile updated successfully.');
      login(localStorage.getItem('token'), { ...user, fullName: data.fullName });
    } catch (err) { setError(err.response?.data?.message || 'Update failed.'); }
  };

  const handlePwdChange = async () => {
    setPwdError(''); setPwdSuccess('');
    if (pwdForm.newPassword.length < 6) return setPwdError('New password must be at least 6 characters.');
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return setPwdError('Passwords do not match.');
    try {
      await changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      setPwdSuccess('Password changed successfully.');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setChangingPwd(false);
    } catch (err) { setPwdError(err.response?.data?.message || 'Failed to change password.'); }
  };

  if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-content"><Loading /></main></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>My Profile</h1>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Personal Information</h3>
              {!editing && <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1a56db', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
                {profile?.fullName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{profile?.fullName}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{profile?.email}</div>
                <span style={{ fontSize: 11, background: profile?.role === 'admin' ? '#fef3c7' : '#dbeafe', color: profile?.role === 'admin' ? '#92400e' : '#1e40af', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
                  {profile?.role === 'admin' ? 'Admin' : 'Citizen'}
                </span>
              </div>
            </div>

            {editing ? (
              <>
                {[['fullName', 'Full Name', 'text'], ['mobile', 'Mobile Number', 'text'], ['address', 'Address', 'text']].map(([k, label, type]) => (
                  <div key={k} className="form-group">
                    <label className="form-label">{label}</label>
                    <input className="form-control" type={type} value={form[k] ?? ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[['Email', profile?.email], ['Mobile', profile?.mobile], ['Address', profile?.address || '—']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{k}</span>
                    <span style={{ fontSize: 14, color: '#111827' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Security</h3>
              {!changingPwd && <button className="btn btn-secondary btn-sm" onClick={() => setChangingPwd(true)}>Change Password</button>}
            </div>

            {changingPwd ? (
              <>
                <ErrorMessage message={pwdError} />
                <SuccessMessage message={pwdSuccess} />
                {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([k, label]) => (
                  <div key={k} className="form-group">
                    <label className="form-label">{label}</label>
                    <input className="form-control" type="password" value={pwdForm[k]} onChange={e => setPwdForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={handlePwdChange}>Update Password</button>
                  <button className="btn btn-secondary" onClick={() => setChangingPwd(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
                <p style={{ fontSize: 14 }}>Keep your account secure with a strong password.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
