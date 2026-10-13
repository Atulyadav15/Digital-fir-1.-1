import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, EmptyState } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { getFIRs } from '../services/firService';

export default function Dashboard() {
  const { user } = useAuth();
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFIRs().then(r => setFirs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: firs.length,
    pending: firs.filter(f => f.status === 'Submitted' || f.status === 'Under Review').length,
    investigation: firs.filter(f => f.status === 'Assigned' || f.status === 'Investigation in Progress').length,
    resolved: firs.filter(f => f.status === 'Resolved' || f.status === 'Closed').length,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.fullName?.split(' ')[0]}! 👋</h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Welcome to Digital FIR System</p>
          </div>
          <Link to="/file-fir" className="btn btn-primary">+ File New FIR</Link>
        </div>

        <div className="stats-grid">
          {[['Total FIRs', stats.total, '📋', '#1a56db'], ['Pending', stats.pending, '⏳', '#d97706'], ['Under Investigation', stats.investigation, '🔍', '#7c3aed'], ['Resolved', stats.resolved, '✅', '#059669']].map(([label, val, icon, color]) => (
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
            <Link to="/my-firs" style={{ fontSize: 13, color: '#1a56db' }}>View All →</Link>
          </div>
          {loading ? <Loading /> : firs.length === 0 ? (
            <EmptyState message="No FIRs filed yet. Click 'File New FIR' to get started." />
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>FIR Number</th><th>Complaint Type</th><th>Date</th><th>Police Station</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {firs.slice(0, 5).map(fir => (
                    <tr key={fir.id}>
                      <td style={{ fontWeight: 600, color: '#1a56db' }}>{fir.referenceNumber}</td>
                      <td>{fir.complaintType}</td>
                      <td>{fir.submittedDate}</td>
                      <td>{fir.policeStation}</td>
                      <td><StatusBadge status={fir.status} /></td>
                      <td><Link to={`/fir/${fir.id}`} className="btn btn-secondary btn-sm">View Details</Link></td>
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
