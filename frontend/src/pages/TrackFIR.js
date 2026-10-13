import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { trackFIR } from '../services/firService';
import { ErrorMessage } from '../components/UI';

const TIMELINE = ['Submitted', 'Under Review', 'Assigned', 'Investigation in Progress', 'Resolved', 'Closed'];

const STATUS_INDEX = { 'Submitted': 0, 'Under Review': 1, 'Assigned': 2, 'Investigation in Progress': 3, 'Resolved': 4, 'Closed': 5 };

export default function TrackFIR() {
  const [ref, setRef] = useState('');
  const [fir, setFir] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ref.trim()) return setError('Please enter a FIR reference number');
    setLoading(true); setError(''); setFir(null);
    try {
      const { data } = await trackFIR(ref.trim().toUpperCase());
      setFir(data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'No FIR found with this reference number. Please check and try again.' : 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const currentIdx = fir ? (STATUS_INDEX[fir.status] ?? -1) : -1;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, background: '#f9fafb', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Track Your FIR</h1>
            <p style={{ color: '#6b7280', fontSize: 16 }}>Enter your FIR reference number to check the current status.</p>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <form onSubmit={handleTrack} style={{ display: 'flex', gap: 12 }}>
              <input
                className="form-control"
                value={ref}
                onChange={e => { setRef(e.target.value); setError(''); }}
                placeholder="e.g. FIR-2024-001"
                style={{ flex: 1, fontSize: 16 }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                {loading ? 'Searching...' : '🔍 Track Status'}
              </button>
            </form>
            {error && <div style={{ marginTop: 12 }}><ErrorMessage message={error} /></div>}
          </div>

          {fir && (
            <>
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>FIR Reference Number</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#1a56db' }}>{fir.referenceNumber}</div>
                  </div>
                  <StatusBadge status={fir.status} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                  {[['Complaint Type', fir.complaintType], ['Submitted Date', fir.submittedDate], ['Police Station', fir.policeStation], ['Last Updated', fir.lastUpdated]].map(([k, v]) => (
                    <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase' }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Investigation Timeline</h3>
                <div style={{ position: 'relative' }}>
                  {TIMELINE.map((status, i) => {
                    const done = i <= currentIdx;
                    const active = i === currentIdx;
                    return (
                      <div key={status} style={{ display: 'flex', gap: 16, marginBottom: i < TIMELINE.length - 1 ? 0 : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: done ? (active ? '#1a56db' : '#059669') : '#e5e7eb', color: done ? '#fff' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, border: active ? '3px solid #93c5fd' : 'none', boxShadow: active ? '0 0 0 4px rgba(26,86,219,0.15)' : 'none' }}>
                            {done && !active ? '✓' : i + 1}
                          </div>
                          {i < TIMELINE.length - 1 && <div style={{ width: 2, height: 40, background: i < currentIdx ? '#059669' : '#e5e7eb', margin: '4px 0' }}></div>}
                        </div>
                        <div style={{ paddingTop: 6, paddingBottom: i < TIMELINE.length - 1 ? 32 : 0 }}>
                          <div style={{ fontWeight: active ? 700 : 600, color: done ? (active ? '#1a56db' : '#059669') : '#9ca3af', fontSize: 15 }}>{status}</div>
                          {active && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Current Status — Last updated: {fir.lastUpdated}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {!fir && !error && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
              <p>Enter your FIR reference number above to track its status.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
