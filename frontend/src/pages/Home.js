import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  { icon: '📝', title: 'File FIR Online', desc: 'Submit your complaint digitally without visiting the police station initially.' },
  { icon: '🔍', title: 'Track FIR Status', desc: 'Check the current status of your submitted FIR using your reference number.' },
  { icon: '🔒', title: 'Secure Records', desc: 'Your complaint and FIR information are securely processed and managed.' },
  { icon: '⚡', title: 'Easy Management', desc: 'Authorized officers can efficiently review and manage FIR records.' },
];

const steps = [
  { num: '01', title: 'Register / Login', desc: 'Create your account or log in to get started.' },
  { num: '02', title: 'Submit Complaint', desc: 'Fill in the FIR form with incident details.' },
  { num: '03', title: 'Get Reference Number', desc: 'Receive a unique FIR reference number instantly.' },
  { num: '04', title: 'Track Status', desc: 'Monitor your FIR status anytime, anywhere.' },
];

const faqs = [
  { q: 'Can I file an FIR without visiting the police station?', a: 'Yes, you can submit your complaint online. However, for certain serious offences, a physical visit may be required for verification.' },
  { q: 'How do I track my FIR?', a: 'Use the "Track FIR" page and enter your FIR reference number to see the current status.' },
  { q: 'Is my personal information secure?', a: 'Yes, all data is encrypted and processed securely. We follow government data protection guidelines.' },
  { q: 'What types of complaints can I file?', a: 'You can file complaints for Theft, Cyber Crime, Missing Person, Harassment, Assault, Fraud, Property Dispute, and more.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <section style={s.hero}>
          <div className="container" style={s.heroInner}>
            <div style={s.heroText}>
              <div style={s.heroBadge}>🇮🇳 Government of India Initiative</div>
              <h1 style={s.heroH1}>Digital FIR System</h1>
              <p style={s.heroSub}>File, manage, and track your FIR complaints online — quickly, securely, and conveniently.</p>
              <div style={s.heroBtns}>
                <Link to="/file-fir" className="btn btn-primary btn-lg">📝 File an FIR</Link>
                <Link to="/track-fir" className="btn btn-secondary btn-lg">🔍 Track FIR</Link>
              </div>
              <div style={s.heroStats}>
                <div style={s.stat}><strong>10,000+</strong><span>FIRs Filed</span></div>
                <div style={s.statDiv}></div>
                <div style={s.stat}><strong>500+</strong><span>Officers</span></div>
                <div style={s.statDiv}></div>
                <div style={s.stat}><strong>98%</strong><span>Satisfaction</span></div>
              </div>
            </div>
            <div style={s.heroIllustration}>
              <div style={s.illustBox}>
                <div style={{ fontSize: 80 }}>🏛️</div>
                <div style={s.illustText}>Secure Digital Platform</div>
                <div style={s.illustBadges}>
                  <span style={s.iBadge}>✅ Verified</span>
                  <span style={s.iBadge}>🔒 Encrypted</span>
                  <span style={s.iBadge}>⚡ Fast</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={s.section}>
          <div className="container">
            <div style={s.sectionHead}>
              <h2 style={s.sectionTitle}>Why Use Digital FIR System?</h2>
              <p style={s.sectionSub}>A modern, secure platform designed for citizens and law enforcement.</p>
            </div>
            <div style={s.featGrid}>
              {features.map(f => (
                <div key={f.title} className="card" style={s.featCard}>
                  <div style={s.featIcon}>{f.icon}</div>
                  <h3 style={s.featTitle}>{f.title}</h3>
                  <p style={s.featDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...s.section, background: '#f0f4ff' }}>
          <div className="container">
            <div style={s.sectionHead}>
              <h2 style={s.sectionTitle}>How It Works</h2>
              <p style={s.sectionSub}>Simple 4-step process to file your FIR online.</p>
            </div>
            <div style={s.stepsGrid}>
              {steps.map((step, i) => (
                <div key={step.num} style={s.stepCard}>
                  <div style={s.stepNum}>{step.num}</div>
                  <h3 style={s.stepTitle}>{step.title}</h3>
                  <p style={s.stepDesc}>{step.desc}</p>
                  {i < steps.length - 1 && <div style={s.stepArrow}>→</div>}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/file-fir" className="btn btn-primary btn-lg">Get Started →</Link>
            </div>
          </div>
        </section>

        <section style={s.section}>
          <div className="container" style={{ maxWidth: 720 }}>
            <div style={s.sectionHead}>
              <h2 style={s.sectionTitle}>Frequently Asked Questions</h2>
            </div>
            {faqs.map((faq, i) => (
              <div key={i} style={s.faqItem} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={s.faqQ}>
                  <span>{faq.q}</span>
                  <span style={s.faqToggle}>{openFaq === i ? '▲' : '▼'}</span>
                </div>
                {openFaq === i && <p style={s.faqA}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        <section style={s.cta}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Ready to File Your Complaint?</h2>
            <p style={{ color: '#bfdbfe', marginBottom: 28, fontSize: 16 }}>Join thousands of citizens who have filed their FIRs digitally.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: '#1a56db' }}>Create Account</Link>
              <Link to="/track-fir" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>Track Existing FIR</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const s = {
  hero: { background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)', padding: '72px 0', color: '#fff' },
  heroInner: { display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' },
  heroText: { flex: 1, minWidth: 280 },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 20, fontSize: 13, marginBottom: 16 },
  heroH1: { fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 },
  heroSub: { fontSize: 18, color: '#bfdbfe', marginBottom: 28, lineHeight: 1.7 },
  heroBtns: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 },
  heroStats: { display: 'flex', alignItems: 'center', gap: 20 },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statDiv: { width: 1, height: 32, background: 'rgba(255,255,255,0.3)' },
  heroIllustration: { flex: '0 0 auto' },
  illustBox: { background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '32px 40px', textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' },
  illustText: { color: '#bfdbfe', fontSize: 14, marginTop: 8, marginBottom: 16 },
  illustBadges: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
  iBadge: { background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 12, fontSize: 12 },
  section: { padding: '64px 0' },
  sectionHead: { textAlign: 'center', marginBottom: 40 },
  sectionTitle: { fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 },
  sectionSub: { fontSize: 16, color: '#6b7280' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 },
  featCard: { textAlign: 'center', padding: 28 },
  featIcon: { fontSize: 40, marginBottom: 14 },
  featTitle: { fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#111827' },
  featDesc: { fontSize: 14, color: '#6b7280', lineHeight: 1.7 },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, position: 'relative' },
  stepCard: { background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #e5e7eb', position: 'relative' },
  stepNum: { width: 44, height: 44, background: '#1a56db', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, margin: '0 auto 14px' },
  stepTitle: { fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#111827' },
  stepDesc: { fontSize: 13, color: '#6b7280', lineHeight: 1.6 },
  stepArrow: { position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#1a56db', zIndex: 1 },
  faqItem: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 20px', marginBottom: 10, cursor: 'pointer' },
  faqQ: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15, color: '#111827' },
  faqToggle: { color: '#1a56db', fontSize: 12 },
  faqA: { marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 },
  cta: { background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)', padding: '64px 0' },
};
