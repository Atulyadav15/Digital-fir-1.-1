import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SuccessMessage } from '../components/UI';

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address';
  if (!form.subject.trim()) errs.subject = 'Subject is required';
  if (!form.message.trim() || form.message.length < 10) errs.message = 'Please enter a message (min 10 characters)';
  return errs;
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setSuccess('Your message has been sent successfully. We will get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1 }}>
        <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)', padding: '60px 0', color: '#fff', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Contact Us</h1>
            <p style={{ fontSize: 18, color: '#bfdbfe' }}>We're here to help. Reach out to us anytime.</p>
          </div>
        </section>

        <section style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
              <div className="card">
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Send a Message</h2>
                <SuccessMessage message={success} />
                <form onSubmit={handleSubmit}>
                  {[['name', 'Your Name', 'text', 'Enter your full name'], ['email', 'Email Address', 'email', 'your@email.com'], ['subject', 'Subject', 'text', 'How can we help?']].map(([k, label, type, ph]) => (
                    <div key={k} className="form-group">
                      <label className="form-label">{label}</label>
                      <input className={`form-control ${errors[k] ? 'error' : ''}`} type={type} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} />
                      {errors[k] && <div className="form-error">{errors[k]}</div>}
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className={`form-control ${errors.message ? 'error' : ''}`} rows={5} placeholder="Describe your issue or query..." value={form.message} onChange={e => set('message', e.target.value)} />
                    {errors.message && <div className="form-error">{errors.message}</div>}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '🏢', title: 'Help Desk', lines: ['Digital FIR System Support', 'Ministry of Home Affairs', 'Government of India'] },
                  { icon: '📧', title: 'Email', lines: ['help@digitalfir.gov.in', 'support@digitalfir.gov.in'] },
                  { icon: '📞', title: 'Phone', lines: ['1800-XXX-XXXX (Toll Free)', '+91-11-XXXX-XXXX'] },
                  { icon: '🕐', title: 'Office Hours', lines: ['Monday – Saturday', '9:00 AM – 6:00 PM IST', 'Closed on Public Holidays'] },
                ].map(item => (
                  <div key={item.title} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                        {item.lines.map(l => <div key={l} style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
