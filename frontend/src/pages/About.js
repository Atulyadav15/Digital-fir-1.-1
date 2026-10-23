import React from 'react';
import { FiClipboard, FiLock, FiSearch } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const cards = [
  { icon: FiClipboard, title: 'Guided submission', desc: 'Submit incident details through a clear, step-by-step form and review them before submission.' },
  { icon: FiLock, title: 'Account based access', desc: 'Passwords are protected and complaint details are limited to the account owner and service administrators.' },
  { icon: FiSearch, title: 'Status tracking', desc: 'Use your complaint reference to view status and recorded updates.' }
];

export default function About() {
  return <div className="page-wrapper">
    <Navbar />
    <main className="main-content">
      <section className="hero" style={{ padding: '58px 0' }}><div className="container"><span className="eyebrow">About Civic Desk</span><h1 style={{ fontSize: 42, margin: '14px 0 8px' }}>A clear way to manage complaints</h1><p style={{ color: '#d6e3f6', maxWidth: 680 }}>Civic Desk helps people submit a complaint, follow its status, and review updates in one place.</p></div></section>
      <section className="section-pad"><div className="container">
        <div className="section-heading"><h2>From submission to resolution</h2><p>Create an account, submit complaint details, and follow status history. Service administrators can review records and add timestamped updates.</p></div>
        <div className="feature-grid about-grid">{cards.map(({ icon: Icon, title, desc }) => <article className="feature-card" key={title}><span className="feature-icon"><Icon /></span><h3>{title}</h3><p>{desc}</p></article>)}</div>
        <div className="service-warning"><strong>Service information</strong><p>Civic Desk is an independent complaint management service, not an official government or police portal. It does not create legally registered FIRs, contact emergency services, or integrate with police systems. Do not use this site for emergencies. Contact local emergency services or your nearest police station for urgent assistance.</p></div>
      </div></section>
    </main>
    <Footer />
  </div>;
}
