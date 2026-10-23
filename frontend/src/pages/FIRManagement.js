import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, EmptyState, ErrorMessage } from '../components/UI';
import { getFIRs } from '../services/firService';

const COMPLAINT_TYPES = ['All', 'Theft', 'Cyber Crime', 'Missing Person', 'Harassment', 'Assault', 'Fraud', 'Property Dispute', 'Other'];
const STATUSES = ['All', 'Submitted', 'Under Review', 'Assigned', 'Investigation in Progress', 'Resolved', 'Closed', 'Rejected', 'Withdrawn'];

export default function FIRManagement() {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get('status');
    if (s) setStatusFilter(s);
  }, [location.search]);

  useEffect(() => {
    getFIRs().then(r => setFirs(r.data)).catch(err => setError(err.response?.data?.message || 'Could not load complaints. Please refresh and try again.')).finally(() => setLoading(false));
  }, []);

  const filtered = firs
    .filter(f => statusFilter === 'All' || f.status === statusFilter)
    .filter(f => typeFilter === 'All' || f.complaintType === typeFilter)
    .filter(f => !search || f.referenceNumber.toLowerCase().includes(search.toLowerCase()) || f.complainantName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'desc' ? new Date(b.submittedDate) - new Date(a.submittedDate) : new Date(a.submittedDate) - new Date(b.submittedDate));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>FIR Management</h1>
        <ErrorMessage message={error} />

        <div className="card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <input aria-label="Search by reference number or complainant name" className="form-control" placeholder="Search by reference number or name" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ flex: 1, minWidth: 200 }} />
            <select aria-label="Filter by status" className="form-control" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ width: 180 }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select aria-label="Filter by complaint type" className="form-control" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} style={{ width: 160 }}>
              {COMPLAINT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <button className="btn btn-secondary" onClick={() => { setSortOrder(o => o === 'desc' ? 'asc' : 'desc'); setPage(1); }}>
              {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
            </button>
          </div>

          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>{filtered.length} FIR(s) found</div>

          {loading ? <Loading /> : filtered.length === 0 ? <EmptyState message="No FIRs match your filters." /> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>FIR Number</th><th>Complainant</th><th>Type</th><th>Date</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {pageItems.map(fir => (
                    <tr key={fir.id}>
                      <td style={{ fontWeight: 600, color: '#1a56db' }}>{fir.referenceNumber}</td>
                      <td>{fir.complainantName}</td>
                      <td>{fir.complaintType}</td>
                      <td>{fir.submittedDate}</td>
                      <td>{fir.incidentCity}, {fir.incidentState}</td>
                      <td><StatusBadge status={fir.status} /></td>
                      <td><Link to={`/admin/fir/${fir.id}/review`} className="btn btn-primary btn-sm">View FIR</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length > 0 && <div className="pagination-row"><span>Page {page} of {pageCount}</span><div><button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button><button className="btn btn-secondary btn-sm" disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>Next</button></div></div>}
        </div>
      </main>
    </div>
  );
}
