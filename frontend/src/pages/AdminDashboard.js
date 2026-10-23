import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, EmptyState, ErrorMessage } from '../components/UI';
import { getFIRs } from '../services/firService';

export default function AdminDashboard() {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getFIRs().then(r => setFirs(r.data)).catch(err => setError(err.response?.data?.message || 'Could not load complaints. Please refresh and try again.')).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: firs.length,
    newFirs: firs.filter(f => f.status === 'Submitted').length,
    investigation: firs.filter(f => f.status === 'Assigned' || f.status === 'Investigation in Progress').length,
    resolved: firs.filter(f => f.status === 'Resolved' || f.status === 'Closed').length,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Administrator dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Overview of fictional complaint records in this project</p>
        </div>
        <ErrorMessage message={error} />

        <div className="stats-grid">
          {[['Total FIRs', stats.total, '📋', '#1a56db'], ['New FIRs', stats.newFirs, '🆕', '#d97706'], ['Under Investigation', stats.investigation, '🔍', '#7c3aed'], ['Resolved FIRs', stats.resolved, '✅', '#059669']].map(([label, val, icon, color]) => (
            <div key={label} className="stat-card">
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div className="stat-value" style={{ color }}>{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Recent FIRs</h2>
            <Link to="/admin/firs" style={{ fontSize: 13, color: '#1a56db' }}>View All →</Link>
          </div>
          {loading ? <Loading /> : firs.length === 0 ? <EmptyState message="No FIRs in the system yet." /> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>FIR Number</th><th>Complainant</th><th>Type</th><th>Date</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {firs.slice(0, 8).map(fir => (
                    <tr key={fir.id}>
                      <td style={{ fontWeight: 600, color: '#1a56db' }}>{fir.referenceNumber}</td>
                      <td>{fir.complainantName}</td>
                      <td>{fir.complaintType}</td>
                      <td>{fir.submittedDate}</td>
                      <td>{fir.incidentCity}</td>
                      <td><StatusBadge status={fir.status} /></td>
                      <td><Link to={`/admin/fir/${fir.id}/review`} className="btn btn-primary btn-sm">Review</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
