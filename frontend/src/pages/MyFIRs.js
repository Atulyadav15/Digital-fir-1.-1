import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, EmptyState, ErrorMessage } from '../components/UI';
import { getFIRs } from '../services/firService';

export default function MyFIRs() {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getFIRs().then(r => setFirs(r.data)).catch(err => setError(err.response?.data?.message || 'Could not load your complaints. Please refresh and try again.')).finally(() => setLoading(false));
  }, []);

  const filtered = firs.filter(f => (!filter || f.status === filter) && (!search || `${f.referenceNumber} ${f.complaintType}`.toLowerCase().includes(search.toLowerCase())));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>My FIRs</h1>
          <Link to="/file-fir" className="btn btn-primary">+ File New FIR</Link>
        </div>
        <ErrorMessage message={error} />

        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['', 'Submitted', 'Under Review', 'Assigned', 'Investigation in Progress', 'Resolved', 'Closed', 'Rejected', 'Withdrawn'].map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setFilter(s); setPage(1); }}>
                {s || 'All'}
              </button>
            ))}
          </div>
          <label htmlFor="my-firs-search" className="form-label">Search your complaints</label>
          <input id="my-firs-search" className="form-control" placeholder="Reference number or complaint type" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 420, marginBottom: 16 }} />
          {loading ? <Loading /> : filtered.length === 0 ? (
            <EmptyState message={filter ? `No FIRs with status "${filter}"` : 'No FIRs filed yet.'} />
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>FIR Number</th><th>Complaint Type</th><th>Date</th><th>Police Station</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {pageItems.map(fir => (
                    <tr key={fir.id}>
                      <td style={{ fontWeight: 600, color: '#1a56db' }}>{fir.referenceNumber}</td>
                      <td>{fir.complaintType}</td>
                      <td>{new Date(fir.submittedDate).toLocaleDateString()}</td>
                      <td>{fir.incidentCity}</td>
                      <td><StatusBadge status={fir.status} /></td>
                      <td><Link to={`/fir/${fir.id}`} className="btn btn-secondary btn-sm">View Details</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length > 0 && <div className="pagination-row"><span>Page {page} of {pageCount} · {filtered.length} complaints</span><div><button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button><button className="btn btn-secondary btn-sm" disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>Next</button></div></div>}
        </div>
      </main>
    </div>
  );
}
