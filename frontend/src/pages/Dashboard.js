import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiClock, FiPlus, FiSearch } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, EmptyState, ErrorMessage } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFIRs } from '../services/firService';

function formatDate(value, language) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(date);
}

export default function Dashboard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getFIRs()
      .then(response => setFirs(response.data))
      .catch(err => setError(err.response?.data?.message || t('dashboard.loadError')))
      .finally(() => setLoading(false));
  }, [t]);

  const recent = useMemo(() => [...firs]
    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
    .slice(0, 5), [firs]);

  const stats = [
    { label: t('dashboard.total'), value: firs.length, Icon: FiClipboard, tone: 'blue' },
    { label: t('dashboard.pending'), value: firs.filter(f => ['Submitted', 'Under Review'].includes(f.status)).length, Icon: FiClock, tone: 'amber' },
    { label: t('dashboard.inProgress'), value: firs.filter(f => ['Assigned', 'Investigation in Progress'].includes(f.status)).length, Icon: FiSearch, tone: 'violet' },
    { label: t('dashboard.resolved'), value: firs.filter(f => ['Resolved', 'Closed'].includes(f.status)).length, Icon: FiCheckCircle, tone: 'green' },
  ];

  const firstName = user?.fullName?.trim().split(/\s+/)[0] || '';

  return (
    <div className="dashboard-layout citizen-dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <header className="dashboard-heading">
          <div>
            <p className="dashboard-eyebrow">{t('dashboard.overview')}</p>
            <h1>{t('dashboard.welcome')}{firstName ? `, ${firstName}` : ''} <span aria-hidden="true">👋</span></h1>
            <p className="dashboard-subtitle">{t('dashboard.subtitle')}</p>
          </div>
          <Link to="/file-fir" className="btn btn-primary dashboard-create"><FiPlus aria-hidden="true" /> {t('dashboard.fileNew')}</Link>
        </header>

        <ErrorMessage message={error} />

        <section className="citizen-stats" aria-label={t('dashboard.overview')}>
          {stats.map(({ label, value, Icon, tone }) => (
            <article key={label} className="citizen-stat-card">
              <div className={`citizen-stat-icon ${tone}`}><Icon aria-hidden="true" /></div>
              <div className="citizen-stat-value">{loading || error ? '—' : value}</div>
              <div className="citizen-stat-label">{label}</div>
            </article>
          ))}
        </section>

        <section className="dashboard-table-card">
          <div className="dashboard-table-heading">
            <div>
              <h2>{t('dashboard.recent')}</h2>
              <p>{t('dashboard.recentHint')}</p>
            </div>
            <Link to="/my-firs" className="dashboard-view-all">{t('dashboard.viewAll')} <span aria-hidden="true">→</span></Link>
          </div>
          {loading ? <Loading /> : recent.length === 0 ? (
            error ? <p className="dashboard-empty-error">{t('dashboard.loadError')}</p> : <EmptyState message={t('dashboard.empty')} />
          ) : (
            <div className="table-wrapper dashboard-table-wrap">
              <table className="citizen-complaint-table">
                <thead><tr>
                  <th>{t('dashboard.reference')}</th><th>{t('dashboard.complaint')}</th><th>{t('dashboard.date')}</th>
                  <th>{t('dashboard.location')}</th><th>{t('dashboard.status')}</th><th>{t('dashboard.action')}</th>
                </tr></thead>
                <tbody>
                  {recent.map(complaint => (
                    <tr key={complaint.id}>
                      <td><Link className="complaint-reference" to={`/fir/${complaint.id}`}>{complaint.referenceNumber}</Link></td>
                      <td><span className="complaint-title-cell">{complaint.title || complaint.complaintType}</span><small className="complaint-category-cell">{complaint.complaintType}</small></td>
                      <td>{formatDate(complaint.submittedDate, language)}</td>
                      <td>{[complaint.incidentCity, complaint.incidentState].filter(Boolean).join(', ') || '—'}</td>
                      <td><StatusBadge status={complaint.status} /></td>
                      <td><Link to={`/fir/${complaint.id}`} className="btn btn-secondary btn-sm">{t('dashboard.viewDetails')}</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
