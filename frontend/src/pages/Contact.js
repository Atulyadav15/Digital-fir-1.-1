import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiMail, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return <div className="page-wrapper">
    <Navbar />
    <main className="main-content">
      <section className="hero" style={{ padding: '58px 0' }}><div className="container"><span className="eyebrow">Support</span><h1 style={{ fontSize: 42, margin: '14px 0 8px' }}>How can we help?</h1><p style={{ color: '#d6e3f6', maxWidth: 600 }}>Find service information and guidance for urgent situations.</p></div></section>
      <section className="section-pad"><div className="container contact-cards">
        <article className="feature-card"><span className="feature-icon"><FiBookOpen /></span><h2>Using Civic Desk</h2><p>Sign in to submit complaints and view status history. Keep your complaint reference for future updates.</p><Link to="/about" className="text-link">About the service <FiArrowRight /></Link></article>
        <article className="feature-card"><span className="feature-icon"><FiShield /></span><h2>Urgent assistance</h2><p>Civic Desk is not monitored for emergencies and cannot register an official FIR. Contact local emergency services or your nearest police station.</p></article>
        <article className="feature-card"><span className="feature-icon"><FiMail /></span><h2>Privacy and records</h2><p>Only provide information needed to describe your complaint. You can request account and record removal through service support.</p></article>
      </div></section>
    </main>
    <Footer />
  </div>;
}
