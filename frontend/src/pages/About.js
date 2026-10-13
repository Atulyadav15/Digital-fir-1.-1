import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const cards = [
  { icon: '💻', title: 'Digital Filing', desc: 'Submit FIR complaints online from anywhere, anytime — no need to visit the police station for initial filing.' },
  { icon: '🔒', title: 'Secure Processing', desc: 'All data is encrypted and processed securely following government data protection guidelines.' },
  { icon: '📍', title: 'Easy Tracking', desc: 'Track your FIR status in real-time using your unique reference number.' },
];

export default function About() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1 }}>
        <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)', padding: '60px 0', color: '#fff', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>About Digital FIR System</h1>
            <p style={{ fontSize: 18, color: '#bfdbfe', maxWidth: 600, margin: '0 auto' }}>A modern platform for digital FIR filing and management.</p>
          </div>
        </section>

        <section style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="card" style={{ padding: 36, marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Our Mission</h2>
              <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.9 }}>
                The Digital FIR System is a web-based platform designed to simplify FIR filing and record management. It provides citizens with an easy way to submit complaints digitally and track their status, while helping authorized personnel efficiently manage FIR records.
              </p>
              <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.9, marginTop: 14 }}>
                Our goal is to make the process of filing a First Information Report (FIR) transparent, accessible, and efficient for every citizen of India — regardless of their location or technical expertise.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
              {cards.map(c => (
                <div key={c.title} className="card" style={{ textAlign: 'center', padding: 28 }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Key Features</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Online FIR submission without visiting the police station', 'Real-time FIR status tracking with reference number', 'Secure document and evidence upload', 'Multi-step guided form for easy complaint filing', 'Admin dashboard for officers to manage and update FIRs', 'Mobile-responsive design for access on any device'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 15, color: '#374151' }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
