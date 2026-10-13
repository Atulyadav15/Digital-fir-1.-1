import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🏛️</span>
          <div>
            <div style={styles.logoText}>Digital FIR System</div>
            <div style={styles.logoSub}>Government of India</div>
          </div>
        </Link>

        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        <div style={menuOpen ? styles.mobileMenu : styles.links}>
          <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/file-fir" style={styles.link} onClick={() => setMenuOpen(false)}>File FIR</Link>
          <Link to="/track-fir" style={styles.link} onClick={() => setMenuOpen(false)}>Track FIR</Link>
          <Link to="/about" style={styles.link} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" style={styles.link} onClick={() => setMenuOpen(false)}>Contact</Link>
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'relative' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 16, fontWeight: 700, color: '#1a56db', lineHeight: 1.2 },
  logoSub: { fontSize: 10, color: '#6b7280', letterSpacing: '0.3px' },
  links: { display: 'flex', alignItems: 'center', gap: 24 },
  mobileMenu: { display: 'flex', flexDirection: 'column', position: 'absolute', top: 64, left: 0, right: 0, background: '#fff', padding: '16px 20px', gap: 12, borderBottom: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 200 },
  link: { fontSize: 14, color: '#374151', fontWeight: 500, transition: 'color 0.15s' },
  hamburger: { display: 'none', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#374151' },
};
