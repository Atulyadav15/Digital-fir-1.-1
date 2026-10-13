import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, EmptyState } from '../components/UI';
import { getFIRs } from '../services/firService';

export default function MyFIRs() {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getFIRs().then(r => setFirs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter ? firs.filter(f => f.status === filter) : firs;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>My FIRs</h1>
          <Link to="/file-fir" className="btn btn-primary">+ File New FIR</Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['', 'Submitted', 'Under Review', 'Assigned', 'Investigation in Progress', 'Resolved', 'Closed'].map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
                {s || 'All'}
              </button>
            ))}
          </div>
          {loading ? <Loading /> : filtered.length === 0 ? (
            <EmptyState message={filter ? `No FIRs with status "${filter}"` : 'No FIRs filed yet.'} />
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>FIR Number</th><th>Complaint Type</th><th>Date</th><th>Police Station</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {filtered.map(fir => (
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
