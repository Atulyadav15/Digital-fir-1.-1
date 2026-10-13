import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitFIR } from '../services/firService';
import { ErrorMessage } from '../components/UI';

const STEPS = ['Personal Info', 'Incident Details', 'Location', 'Evidence', 'Review & Submit'];
const COMPLAINT_TYPES = ['Theft', 'Cyber Crime', 'Missing Person', 'Harassment', 'Assault', 'Fraud', 'Property Dispute', 'Other'];
const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const initForm = {
  complainantName: '', complainantMobile: '', complainantEmail: '', complainantAddress: '', complainantCity: '', complainantState: '',
  complaintType: '', incidentDate: '', incidentTime: '', description: '',
  incidentLocation: '', incidentCity: '', incidentState: '', incidentPinCode: '',
  evidence: []
};

function validateStep(step, form) {
  const errs = {};
  if (step === 0) {
    if (!form.complainantName.trim()) errs.complainantName = 'Name is required';
    if (!form.complainantMobile || !/^\d{10}$/.test(form.complainantMobile)) errs.complainantMobile = 'Please enter a valid 10-digit mobile number';
    if (form.complainantEmail && !/\S+@\S+\.\S+/.test(form.complainantEmail)) errs.complainantEmail = 'Please enter a valid email address';
    if (!form.complainantCity.trim()) errs.complainantCity = 'City is required';
    if (!form.complainantState) errs.complainantState = 'State is required';
  }
  if (step === 1) {
    if (!form.complaintType) errs.complaintType = 'Please select a complaint type';
    if (!form.incidentDate) errs.incidentDate = 'Incident date is required';
    if (!form.description.trim() || form.description.length < 20) errs.description = 'Please provide details about the incident (min 20 characters)';
  }
  if (step === 2) {
    if (!form.incidentLocation.trim()) errs.incidentLocation = 'Location is required';
    if (!form.incidentCity.trim()) errs.incidentCity = 'City is required';
    if (!form.incidentState) errs.incidentState = 'State is required';
    if (form.incidentPinCode && !/^\d{6}$/.test(form.incidentPinCode)) errs.incidentPinCode = 'Please enter a valid 6-digit PIN code';
  }
  return errs;
}

export default function FileFIR() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const next = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) return setErrors(errs);
    setStep(s => s + 1);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).map(f => ({ name: f.name, type: f.type, size: f.size }));
    setForm(f => ({ ...f, evidence: [...f.evidence, ...files] }));
  };

  const removeFile = (i) => setForm(f => ({ ...f, evidence: f.evidence.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    setLoading(true); setApiError('');
    try {
      const { data } = await submitFIR(form);
      setSubmitted(data);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (submitted) return <SuccessScreen fir={submitted} navigate={navigate} />;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ padding: '40px 0', background: '#f9fafb', flex: 1 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>File an FIR</h1>
          <p style={{ color: '#6b7280', marginBottom: 28 }}>Complete all steps to submit your complaint.</p>

          <div style={s.stepBar}>
            {STEPS.map((label, i) => (
              <div key={i} style={s.stepItem}>
                <div style={{ ...s.stepCircle, ...(i < step ? s.stepDone : i === step ? s.stepActive : s.stepPending) }}>
                  {i < step ? '✓' : String(i + 1).padStart(2, '0')}
                </div>
                <span style={{ ...s.stepLabel, color: i === step ? '#1a56db' : '#6b7280' }}>{label}</span>
                {i < STEPS.length - 1 && <div style={{ ...s.stepLine, background: i < step ? '#1a56db' : '#e5e7eb' }}></div>}
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <ErrorMessage message={apiError} />
            {step === 0 && <Step1 form={form} set={set} errors={errors} states={STATES} />}
            {step === 1 && <Step2 form={form} set={set} errors={errors} types={COMPLAINT_TYPES} />}
            {step === 2 && <Step3 form={form} set={set} errors={errors} states={STATES} />}
            {step === 3 && <Step4 form={form} onUpload={handleFileUpload} onRemove={removeFile} />}
            {step === 4 && <Step5 form={form} onEdit={setStep} />}

            <div style={s.navBtns}>
              {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Previous</button>}
              <div style={{ flex: 1 }}></div>
              {step < 4 && <button className="btn btn-primary" onClick={next}>Next →</button>}
              {step === 4 && <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : '✅ Submit FIR'}</button>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

function Step1({ form, set, errors, states }) {
  return (
    <div>
      <h2 style={s.stepTitle}>Step 1 — Personal Information</h2>
      <div style={s.grid2}>
        <Field label="Full Name *" error={errors.complainantName}>
          <input className={`form-control ${errors.complainantName ? 'error' : ''}`} value={form.complainantName} onChange={e => set('complainantName', e.target.value)} placeholder="Your full name" />
        </Field>
        <Field label="Mobile Number *" error={errors.complainantMobile}>
          <input className={`form-control ${errors.complainantMobile ? 'error' : ''}`} value={form.complainantMobile} onChange={e => set('complainantMobile', e.target.value)} placeholder="10-digit mobile number" />
        </Field>
      </div>
      <Field label="Email Address" error={errors.complainantEmail}>
        <input className={`form-control ${errors.complainantEmail ? 'error' : ''}`} type="email" value={form.complainantEmail} onChange={e => set('complainantEmail', e.target.value)} placeholder="Optional" />
      </Field>
      <Field label="Address">
        <input className="form-control" value={form.complainantAddress} onChange={e => set('complainantAddress', e.target.value)} placeholder="Your address" />
      </Field>
      <div style={s.grid2}>
        <Field label="City *" error={errors.complainantCity}>
          <input className={`form-control ${errors.complainantCity ? 'error' : ''}`} value={form.complainantCity} onChange={e => set('complainantCity', e.target.value)} placeholder="City" />
        </Field>
        <Field label="State *" error={errors.complainantState}>
          <select className={`form-control ${errors.complainantState ? 'error' : ''}`} value={form.complainantState} onChange={e => set('complainantState', e.target.value)}>
            <option value="">Select State</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function Step2({ form, set, errors, types }) {
  return (
    <div>
      <h2 style={s.stepTitle}>Step 2 — Incident Details</h2>
      <Field label="Type of Complaint *" error={errors.complaintType}>
        <select className={`form-control ${errors.complaintType ? 'error' : ''}`} value={form.complaintType} onChange={e => set('complaintType', e.target.value)}>
          <option value="">Select complaint type</option>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <div style={s.grid2}>
        <Field label="Date of Incident *" error={errors.incidentDate}>
          <input className={`form-control ${errors.incidentDate ? 'error' : ''}`} type="date" value={form.incidentDate} onChange={e => set('incidentDate', e.target.value)} max={new Date().toISOString().split('T')[0]} />
        </Field>
        <Field label="Time of Incident">
          <input className="form-control" type="time" value={form.incidentTime} onChange={e => set('incidentTime', e.target.value)} />
        </Field>
      </div>
      <Field label="Description of Incident *" error={errors.description}>
        <textarea className={`form-control ${errors.description ? 'error' : ''}`} rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the incident in detail — what happened, who was involved, any witnesses, etc." style={{ minHeight: 140 }} />
      </Field>
      <p style={{ fontSize: 12, color: '#6b7280' }}>Characters: {form.description.length} (minimum 20 required)</p>
    </div>
  );
}

function Step3({ form, set, errors, states }) {
  return (
    <div>
      <h2 style={s.stepTitle}>Step 3 — Incident Location</h2>
      <Field label="Location / Address *" error={errors.incidentLocation}>
        <input className={`form-control ${errors.incidentLocation ? 'error' : ''}`} value={form.incidentLocation} onChange={e => set('incidentLocation', e.target.value)} placeholder="Where did the incident occur?" />
      </Field>
      <div style={s.grid2}>
        <Field label="City *" error={errors.incidentCity}>
          <input className={`form-control ${errors.incidentCity ? 'error' : ''}`} value={form.incidentCity} onChange={e => set('incidentCity', e.target.value)} placeholder="City" />
        </Field>
        <Field label="State *" error={errors.incidentState}>
          <select className={`form-control ${errors.incidentState ? 'error' : ''}`} value={form.incidentState} onChange={e => set('incidentState', e.target.value)}>
            <option value="">Select State</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="PIN Code" error={errors.incidentPinCode}>
        <input className={`form-control ${errors.incidentPinCode ? 'error' : ''}`} value={form.incidentPinCode} onChange={e => set('incidentPinCode', e.target.value)} placeholder="6-digit PIN code" maxLength={6} />
      </Field>
      <div style={s.mapPlaceholder}>
        <span style={{ fontSize: 32 }}>🗺️</span>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>Map integration available in production version</p>
      </div>
    </div>
  );
}

function Step4({ form, onUpload, onRemove }) {
  return (
    <div>
      <h2 style={s.stepTitle}>Step 4 — Evidence (Optional)</h2>
      <div className="alert alert-info">⚠️ Do not upload unnecessary personal or sensitive documents.</div>
      <div style={s.uploadBox}>
        <span style={{ fontSize: 36 }}>📎</span>
        <p style={{ color: '#374151', fontWeight: 600, marginTop: 8 }}>Upload Supporting Documents</p>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }}>Photos, screenshots, documents (JPG, PNG, PDF)</p>
        <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
          Choose Files
          <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={onUpload} style={{ display: 'none' }} />
        </label>
      </div>
      {form.evidence.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Selected Files:</p>
          {form.evidence.map((f, i) => (
            <div key={i} style={s.fileItem}>
              <span>📄 {f.name}</span>
              <span style={{ color: '#6b7280', fontSize: 12 }}>{f.type}</span>
              <button onClick={() => onRemove(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step5({ form, onEdit }) {
  const sections = [
    { title: 'Personal Information', step: 0, fields: [['Name', form.complainantName], ['Mobile', form.complainantMobile], ['Email', form.complainantEmail || '—'], ['City', form.complainantCity], ['State', form.complainantState]] },
    { title: 'Incident Details', step: 1, fields: [['Complaint Type', form.complaintType], ['Date', form.incidentDate], ['Time', form.incidentTime || '—'], ['Description', form.description]] },
    { title: 'Location', step: 2, fields: [['Location', form.incidentLocation], ['City', form.incidentCity], ['State', form.incidentState], ['PIN Code', form.incidentPinCode || '—']] },
  ];
  return (
    <div>
      <h2 style={s.stepTitle}>Step 5 — Review & Submit</h2>
      <div className="alert alert-info">📋 Please verify that the information provided is correct before submitting.</div>
      {sections.map(sec => (
        <div key={sec.title} style={s.reviewSection}>
          <div style={s.reviewHeader}>
            <span style={{ fontWeight: 700, color: '#111827' }}>{sec.title}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(sec.step)}>Edit</button>
          </div>
          <div style={s.reviewGrid}>
            {sec.fields.map(([k, v]) => (
              <div key={k} style={s.reviewField}>
                <span style={s.reviewKey}>{k}</span>
                <span style={s.reviewVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {form.evidence.length > 0 && (
        <div style={s.reviewSection}>
          <div style={s.reviewHeader}><span style={{ fontWeight: 700 }}>Evidence</span></div>
          <p style={{ fontSize: 14, color: '#374151' }}>{form.evidence.length} file(s) attached</p>
        </div>
      )}
    </div>
  );
}

function SuccessScreen({ fir, navigate }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#f9fafb' }}>
        <div className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginBottom: 8 }}>FIR Submitted Successfully!</h2>
          <p style={{ color: '#6b7280', marginBottom: 28 }}>Your complaint has been registered. Please save your reference number.</p>
          <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>FIR Reference Number</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', letterSpacing: 1 }}>{fir.referenceNumber}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28, textAlign: 'left' }}>
            {[['Submission Date', fir.submittedDate], ['Complaint Type', fir.complaintType], ['Police Station', fir.policeStation], ['Status', fir.status]].map(([k, v]) => (
              <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/track-fir')}>🔍 Track FIR</button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const s = {
  stepBar: { display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 8 },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  stepCircle: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, zIndex: 1, position: 'relative' },
  stepActive: { background: '#1a56db', color: '#fff' },
  stepDone: { background: '#059669', color: '#fff' },
  stepPending: { background: '#e5e7eb', color: '#6b7280' },
  stepLabel: { fontSize: 11, marginTop: 6, textAlign: 'center', fontWeight: 500 },
  stepLine: { position: 'absolute', top: 18, left: 'calc(50% + 18px)', right: 'calc(-50% + 18px)', height: 2, zIndex: 0 },
  stepTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#111827' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  navBtns: { display: 'flex', alignItems: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid #e5e7eb' },
  mapPlaceholder: { background: '#f9fafb', border: '2px dashed #e5e7eb', borderRadius: 8, padding: 32, textAlign: 'center', marginTop: 8 },
  uploadBox: { border: '2px dashed #d1d5db', borderRadius: 12, padding: 32, textAlign: 'center', background: '#f9fafb' },
  fileItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#f9fafb', borderRadius: 6, marginBottom: 6, fontSize: 13 },
  reviewSection: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 14 },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  reviewField: { display: 'flex', flexDirection: 'column', gap: 2 },
  reviewKey: { fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' },
  reviewVal: { fontSize: 14, color: '#111827' },
};
