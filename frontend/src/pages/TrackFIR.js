import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { trackFIR } from '../services/firService';
import { ErrorMessage } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function TrackFIR() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const dateLocale = language === 'hi' ? 'hi-IN' : 'en-IN';
  const [ref, setRef] = useState('');
  const [fir, setFir] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ref.trim()) return setError(t('track.empty'));
    setLoading(true); setError(''); setFir(null);
    try {
      const { data } = await trackFIR(ref.trim().toUpperCase());
      setFir(data);
    } catch (err) {
      setError(err.response?.status === 404 ? t('track.notFound') : t('track.failed'));
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, background: '#f9fafb', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>{t('track.heading')}</h1>
            <p style={{ color: '#6b7280', fontSize: 16 }}>{t('track.subtitle')}</p>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            {!user ? <div className="alert alert-info" role="status">{t('track.authRequired')} <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>{t('track.signIn')}</Link></div> : <form onSubmit={handleTrack} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <label className="visually-hidden" htmlFor="complaint-reference">{t('track.referenceLabel')}</label>
              <input
                id="complaint-reference"
                className="form-control"
                aria-label={t('track.referenceLabel')}
                required
                value={ref}
                onChange={e => { setRef(e.target.value); setError(''); }}
                placeholder={t('track.placeholder')}
                style={{ flex: 1, fontSize: 16 }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                {loading ? t('track.searching') : `🔍 ${t('track.button')}`}
              </button>
            </form>}
            {error && <div style={{ marginTop: 12 }}><ErrorMessage message={error} /></div>}
          </div>

          {fir && (
            <>
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{t('track.ref')}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#092D67' }}>{fir.referenceNumber}</div>
                  </div>
                  <StatusBadge status={fir.status} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                  {[[t('track.category'), fir.complaintType], [t('track.submitted'), new Date(fir.submittedDate).toLocaleString(dateLocale)], [t('track.updated'), new Date(fir.lastUpdated).toLocaleString(dateLocale)]].map(([k, v]) => (
                    <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase' }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>{t('track.timeline')}</h3>
                <div style={{ position: 'relative' }}>
                  {(fir.history?.length ? fir.history : [{ status: fir.status, at: fir.lastUpdated }]).map((item, i, history) => <div key={`${item.status}-${item.at}-${i}`} style={{ display: 'flex', gap: 13 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', flexShrink: 0, borderRadius: '50%', background: i === history.length - 1 ? '#2563eb' : '#dcfce7', color: i === history.length - 1 ? '#fff' : '#15803d', fontSize: 12, fontWeight: 700 }}>{i === history.length - 1 ? '•' : '✓'}</span>{i < history.length - 1 && <span style={{ width: 2, minHeight: 26, flex: 1, background: '#dce5f1' }} />}</div>
                    <div style={{ paddingBottom: 20 }}><strong style={{ display: 'block', color: '#172840', fontSize: 14 }}>{t(`status.${item.status}`)}</strong><time style={{ color: '#718096', fontSize: 12 }}>{new Date(item.at).toLocaleString(dateLocale)}</time>{item.note && <p style={{ color: '#52627a', fontSize: 12, marginTop: 5 }}>{item.note}</p>}</div>
                  </div>)}
                  {fir.assignedOfficer && <p style={{ color: '#4c5c72', fontSize: 12, marginTop: 2 }}>{t('track.assigned')} {fir.assignedOfficer}</p>}
                  <p style={{ color: '#718096', fontSize: 12, marginTop: 2 }}>{t('track.privacy')}</p>
                </div>
              </div>
            </>
          )}

          {!fir && !error && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
              <p>{user ? t('track.enter') : t('track.signInHint')}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
