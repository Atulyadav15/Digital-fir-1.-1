import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Loading, ErrorMessage, SuccessMessage } from '../components/UI';
import { getFIR, updateFIRStatus } from '../services/firService';

const STATUSES = ['Submitted', 'Under Review', 'Assigned', 'Investigation in Progress', 'Resolved', 'Closed'];

export default function FIRReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fir, setFir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ status: '', assignedOfficer: '', remarks: '' });
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getFIR(id).then(r => {
      setFir(r.data);
      setForm({ status: r.data.status, assignedOfficer: r.data.assignedOfficer || '', remarks: r.data.remarks || '' });
    }).catch(err => setError(err.response?.data?.message || 'Failed to load FIR')).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const { data } = await updateFIRStatus(id, form);
      setFir(data);
      setSuccess('FIR status updated successfully.');
      setModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-content"><Loading /></main></div>;
  if (error && !fir) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-content"><ErrorMessage message={error} /></main></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#1a56db', cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>← Back</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>FIR Review</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <span style={{ fontWeight: 700, color: '#1a56db' }}>{fir.referenceNumber}</span>
              <StatusBadge status={fir.status} />
            </div>
          </div>
        </div>

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 20, alignItems: 'start' }}>
          <div>
            {[
              { title: '👤 Complainant', fields: [['Name', fir.complainantName], ['Mobile', fir.complainantMobile], ['Email', fir.complainantEmail || '—'], ['City', fir.complainantCity], ['State', fir.complainantState]] },
              { title: '⚠️ Incident', fields: [['Type', fir.complaintType], ['Date', fir.incidentDate], ['Time', fir.incidentTime || '—'], ['Location', `${fir.incidentLocation}, ${fir.incidentCity}`]] },
            ].map(sec => (
              <div key={sec.title} className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{sec.title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {sec.fields.map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 14, color: '#111827' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>📝 Description</h3>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, background: '#f9fafb', padding: 14, borderRadius: 8 }}>{fir.description}</p>
            </div>
          </div>

          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Update FIR</h3>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Officer</label>
              <input className="form-control" value={form.assignedOfficer} onChange={e => setForm(f => ({ ...f, assignedOfficer: e.target.value }))} placeholder="Officer name" />
            </div>
            <div className="form-group">
              <label className="form-label">Investigation Remarks</label>
              <textarea className="form-control" rows={4} value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} placeholder="Add investigation notes..." />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setModal(true)}>Update FIR Status</button>
          </div>
        </div>

        <Modal
          isOpen={modal}
          title="Confirm Status Update"
          message={`Are you sure you want to update the status to "${form.status}"? This action will be recorded.`}
          onConfirm={handleUpdate}
          onCancel={() => setModal(false)}
          confirmText={saving ? 'Updating...' : 'Confirm Update'}
        />
      </main>
    </div>
  );
}
