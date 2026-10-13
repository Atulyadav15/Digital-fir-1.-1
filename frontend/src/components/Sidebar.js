import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const citizenLinks = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/file-fir', label: '📝 File FIR' },
  { to: '/my-firs', label: '📋 My FIRs' },
  { to: '/track-fir', label: '🔍 Track FIR' },
  { to: '/profile', label: '👤 Profile' },
];

const adminLinks = [
  { to: '/admin', label: '🏠 Dashboard' },
  { to: '/admin/firs', label: '📋 FIR Management' },
  { to: '/admin/firs?status=Submitted', label: '🆕 Pending FIRs' },
  { to: '/admin/firs?status=Investigation in Progress', label: '🔍 Active Investigations' },
  { to: '/admin/firs?status=Resolved', label: '✅ Resolved FIRs' },
  { to: '/profile', label: '👤 Profile' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : citizenLinks;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🏛️ Digital FIR</h2>
        <p>{user?.fullName}</p>
        <span style={{ fontSize: 11, background: isAdmin ? '#fef3c7' : '#dbeafe', color: isAdmin ? '#92400e' : '#1e40af', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
          {isAdmin ? 'Admin' : 'Citizen'}
        </span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to.split('?')[0] ? 'active' : ''}>{l.label}</Link>
        ))}
        <button onClick={handleLogout} style={{ color: '#dc2626' }}>🚪 Logout</button>
      </nav>
    </aside>
  );
}
