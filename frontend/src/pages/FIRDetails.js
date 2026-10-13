import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, ErrorMessage } from '../components/UI';
import { getFIR } from '../services/firService';
import { useAuth } from '../context/AuthContext';

export default function FIRDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [fir, setFir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getFIR(id).then(r => setFir(r.data)).catch(err => setError(err.response?.data?.message || 'Failed to load FIR')).finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-content"><Loading /></main></div>;
  if (error) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-content"><ErrorMessage message={error} /></main></div>;

  const sections = [
    { title: '📋 FIR Information', fields: [['FIR Number', fir.referenceNumber], ['Submission Date', fir.submittedDate], ['Last Updated', fir.lastUpdated], ['Police Station', fir.policeStation]] },
    { title: '👤 Complainant Information', fields: [['Name', fir.complainantName], ['Mobile', fir.complainantMobile], ['Email', fir.complainantEmail || '—'], ['Address', `${fir.complainantAddress || ''}, ${fir.complainantCity}, ${fir.complainantState}`]] },
    { title: '⚠️ Incident Information', fields: [['Complaint Type', fir.complaintType], ['Incident Date', fir.incidentDate], ['Incident Time', fir.incidentTime || '—'], ['Location', `${fir.incidentLocation}, ${fir.incidentCity}, ${fir.incidentState}`]] },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#1a56db', cursor: 'pointer', fontSize: 14, marginBottom: 4 }}>← Back</button>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>FIR Details</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={handlePrint}>🖨️ Print / Download</button>
            {isAdmin && <button className="btn btn-primary" onClick={() => navigate(`/admin/fir/${id}/review`)}>Review FIR</button>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#1a56db' }}>{fir.referenceNumber}</span>
          <StatusBadge status={fir.status} />
        </div>

        {sections.map(sec => (
          <div key={sec.title} className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#111827' }}>{sec.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {sec.fields.map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 14, color: '#111827', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📝 Incident Description</h3>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, background: '#f9fafb', padding: 16, borderRadius: 8 }}>{fir.description}</p>
        </div>

        {fir.evidence?.length > 0 && (
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📎 Evidence</h3>
            {fir.evidence.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: '#f9fafb', borderRadius: 6, marginBottom: 6, fontSize: 13 }}>
                <span>📄</span><span>{f.name}</span><span style={{ color: '#6b7280' }}>{f.type}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔍 Investigation Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[['Assigned Officer', fir.assignedOfficer || 'Not yet assigned'], ['Current Status', fir.status], ['Last Updated', fir.lastUpdated]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 14, color: '#111827', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          {fir.remarks && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Remarks</div>
              <p style={{ fontSize: 14, color: '#374151', background: '#f9fafb', padding: 12, borderRadius: 6 }}>{fir.remarks}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
