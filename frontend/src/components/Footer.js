import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          <div>
            <div style={styles.brand}>🏛️ Digital FIR System</div>
            <p style={styles.desc}>A digital platform for citizens to file and track FIR complaints online, securely and conveniently.</p>
          </div>
          <div>
            <div style={styles.heading}>Quick Links</div>
            <div style={styles.links}>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/file-fir" style={styles.link}>File FIR</Link>
              <Link to="/track-fir" style={styles.link}>Track FIR</Link>
              <Link to="/about" style={styles.link}>About</Link>
            </div>
          </div>
          <div>
            <div style={styles.heading}>Legal</div>
            <div style={styles.links}>
              <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
              <Link to="/terms" style={styles.link}>Terms & Conditions</Link>
            </div>
          </div>
          <div>
            <div style={styles.heading}>Contact</div>
            <div style={styles.links}>
              <span style={styles.link}>📧 help@digitalfir.gov.in</span>
              <span style={styles.link}>📞 1800-XXX-XXXX (Toll Free)</span>
              <span style={styles.link}>🕐 Mon–Sat, 9AM–6PM</span>
            </div>
          </div>
        </div>
        <div style={styles.bottom}>
          <span>© {new Date().getFullYear()} Digital FIR System. All rights reserved.</span>
          <span>Government of India Initiative</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#1e293b', color: '#94a3b8', marginTop: 'auto', paddingTop: 48, paddingBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 },
  brand: { fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 },
  desc: { fontSize: 13, lineHeight: 1.7 },
  heading: { fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 },
  links: { display: 'flex', flexDirection: 'column', gap: 8 },
  link: { fontSize: 13, color: '#94a3b8', textDecoration: 'none', cursor: 'pointer' },
  bottom: { borderTop: '1px solid #334155', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12 },
};
