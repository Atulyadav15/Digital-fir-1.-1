import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const citizenLinks = [
  { to: '/dashboard', icon: '⌂', key: 'side.dashboard' },
  { to: '/file-fir', icon: '✎', key: 'side.file' },
  { to: '/my-firs', icon: '▤', key: 'side.mine' },
  { to: '/track-fir', icon: '⌕', key: 'side.track' },
  { to: '/profile', icon: '◉', key: 'side.profile' },
];

const adminLinks = [
  { to: '/admin', icon: '⌂', key: 'side.dashboard' },
  { to: '/admin/firs', icon: '▤', key: 'side.firManagement' },
  { to: '/admin/firs?status=Submitted', icon: '◷', key: 'side.pending' },
  { to: '/admin/firs?status=Investigation in Progress', icon: '⌕', key: 'side.investigations' },
  { to: '/admin/firs?status=Resolved', icon: '✓', key: 'side.resolved' },
  { to: '/profile', icon: '◉', key: 'side.profile' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const links = isAdmin ? adminLinks : citizenLinks;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-brand"><span className="sidebar-brand-icon">CD</span><h2>Civic Desk</h2></div>
        <p>{user?.fullName}</p>
        <span style={{ fontSize: 11, background: isAdmin ? '#fef3c7' : '#dbeafe', color: isAdmin ? '#92400e' : '#1e40af', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
          {isAdmin ? t('side.administrator') : t('side.citizen')}
        </span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to.split('?')[0] ? 'active' : ''}><span className="sidebar-link-icon" aria-hidden="true">{l.icon}</span>{t(l.key)}</Link>
        ))}
        <button onClick={handleLogout} style={{ color: '#dc2626' }}><span className="sidebar-link-icon" aria-hidden="true">↪</span>{t('side.logout')}</button>
      </nav>
    </aside>
  );
}
