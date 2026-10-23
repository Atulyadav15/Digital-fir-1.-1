import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();


  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
          <Link to="/" style={styles.logo} aria-label="Civic Desk home">
          <span style={styles.logoIcon}>CD</span>
          <div>
            <div style={styles.logoText}>Civic Desk</div>
            <div style={styles.logoSub}>Complaint management</div>
          </div>
        </Link>

        <button style={styles.hamburger} aria-label={menuOpen ? t('nav.close') : t('nav.open')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        <div className={`nav-links${menuOpen ? ' is-open' : ''}`} style={menuOpen ? styles.mobileMenu : styles.links}>
          <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/file-fir" style={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.file')}</Link>
          <Link to="/track-fir" style={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.track')}</Link>
          <Link to="/about" style={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
          <Link to="/contact" style={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>
          <LanguageSelector />
          {user ? (
            <><NotificationBell /><Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>{t('nav.dashboard')}</Link><button className="nav-logout" onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}>{t('nav.signout')}</button></>
          ) : (
            <><Link to="/login" style={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.signin')}</Link><Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>{t('nav.signup')}</Link></>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'relative' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoIcon: { display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 10, fontSize: 12, fontWeight: 800, color: '#fff', background: '#092D67', letterSpacing: '-.04em' },
  logoText: { fontSize: 16, fontWeight: 700, color: '#092D67', lineHeight: 1.2 },
  logoSub: { fontSize: 10, color: '#6b7280', letterSpacing: '0.3px' },
  links: { display: 'flex', alignItems: 'center', gap: 24 },
  mobileMenu: { display: 'flex', flexDirection: 'column', position: 'absolute', top: 64, left: 0, right: 0, background: '#fff', padding: '16px 20px', gap: 12, borderBottom: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 200 },
  link: { fontSize: 14, color: '#374151', fontWeight: 500, transition: 'color 0.15s' },
  hamburger: { display: 'none', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#374151' },
};
