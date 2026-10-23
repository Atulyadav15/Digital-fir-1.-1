import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitFIR } from '../services/firService';
import { ErrorMessage } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';

const HI = {
  'Personal Info':'व्यक्तिगत जानकारी','Incident Details':'घटना का विवरण','Location':'स्थान','Evidence':'साक्ष्य','Review & Submit':'जाँचें और जमा करें',
  'Name is required':'नाम आवश्यक है','Please enter a valid 10-digit mobile number':'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें','Please enter a valid email address':'कृपया सही ईमेल पता दर्ज करें','City is required':'शहर आवश्यक है','State is required':'राज्य आवश्यक है','Complaint title is required':'शिकायत का शीर्षक आवश्यक है','Please select a complaint type':'कृपया शिकायत का प्रकार चुनें','Incident date is required':'घटना की तारीख आवश्यक है','Please provide details about the incident (min 20 characters)':'घटना का विवरण दें (कम से कम 20 अक्षर)','Location is required':'स्थान आवश्यक है','Please enter a valid 6-digit PIN code':'कृपया 6 अंकों का सही पिन कोड दर्ज करें',
  'Preview only: choose up to 5 JPG, PNG, or PDF files, each no larger than 5 MB. File contents are not uploaded.':'केवल पूर्वावलोकन: अधिकतम 5 JPG, PNG या PDF फ़ाइलें चुनें, प्रत्येक 5 MB तक। फ़ाइलें अपलोड नहीं होंगी।','Please acknowledge the privacy notice before submitting.':'जमा करने से पहले गोपनीयता सूचना स्वीकार करें।','Submission failed. Please try again.':'शिकायत जमा नहीं हो सकी। कृपया फिर प्रयास करें।',
  'Submit a complaint':'शिकायत दर्ज करें','Complete all steps to submit your complaint.':'शिकायत जमा करने के लिए सभी चरण पूरे करें।','Step 1 — Personal Information':'चरण 1 — व्यक्तिगत जानकारी','Step 2 — Incident Details':'चरण 2 — घटना का विवरण','Step 3 — Incident Location':'चरण 3 — घटना का स्थान','Step 4 — Evidence (Optional)':'चरण 4 — साक्ष्य (वैकल्पिक)','Step 5 — Review & Submit':'चरण 5 — जाँचें और जमा करें',
  'Full Name *':'पूरा नाम *','Your full name':'अपना पूरा नाम','Mobile Number *':'मोबाइल नंबर *','10-digit mobile number':'10 अंकों का मोबाइल नंबर','Email Address':'ईमेल पता','Optional':'वैकल्पिक','Address':'पता','Your address':'अपना पता','City *':'शहर *','City':'शहर','State *':'राज्य *','Select State':'राज्य चुनें','Complaint Title *':'शिकायत का शीर्षक *','Briefly summarize the issue':'समस्या का संक्षिप्त विवरण दें','Type of Complaint *':'शिकायत का प्रकार *','Select complaint type':'शिकायत का प्रकार चुनें','Subcategory (optional)':'उपश्रेणी (वैकल्पिक)','Add a more specific category':'अधिक विशिष्ट श्रेणी लिखें','Date of Incident *':'घटना की तारीख *','Time of Incident':'घटना का समय','Description of Incident *':'घटना का विवरण *','Describe the incident in detail — what happened, who was involved, any witnesses, etc.':'घटना का पूरा विवरण दें — क्या हुआ, कौन शामिल था, कोई गवाह आदि।','Characters: ':'अक्षर: ',' (minimum 20 required)':' (कम से कम 20 आवश्यक)',
  'Location / Address *':'स्थान / पता *','Where did the incident occur?':'घटना कहाँ हुई?','6-digit PIN code':'6 अंकों का पिन कोड','Map integration available in production version':'मानचित्र सुविधा उपलब्ध नहीं है।',
  'Do not upload unnecessary personal or sensitive documents.':'अनावश्यक निजी या संवेदनशील दस्तावेज़ साझा न करें।','Upload Supporting Documents':'सहायक दस्तावेज़ चुनें','Preview up to 5 JPG, PNG, or PDF files (5 MB each). File contents are not uploaded or saved.':'अधिकतम 5 JPG, PNG या PDF फ़ाइलों का पूर्वावलोकन करें (प्रत्येक 5 MB तक)। फ़ाइलें अपलोड या सहेजी नहीं जातीं।','Choose Files':'फ़ाइलें चुनें','Selected Files:':'चुनी गई फ़ाइलें:','Please verify that the information provided is correct before submitting.':'जमा करने से पहले दी गई जानकारी जाँच लें।','Edit':'बदलें','Title':'शीर्षक','Category':'श्रेणी','Subcategory':'उपश्रेणी','Date':'तारीख','Time':'समय','Description':'विवरण','Name':'नाम','Mobile':'मोबाइल','Email':'ईमेल','State':'राज्य','Personal Information':'व्यक्तिगत जानकारी',' file(s) selected for preview. Contents are not sent to the server.':' फ़ाइलों का पूर्वावलोकन चुना गया है। फ़ाइलें सर्वर पर नहीं भेजी जाएँगी।','This is an independent complaint service, not an official FIR portal. Use fictional information only.':'यह एक स्वतंत्र शिकायत सेवा है, आधिकारिक FIR पोर्टल नहीं। केवल काल्पनिक जानकारी दें।',
  'Complaint submitted':'शिकायत जमा हो गई','This confirmation is not a legally registered FIR or an official filing receipt.':'यह पुष्टि कानूनी रूप से पंजीकृत FIR या आधिकारिक रसीद नहीं है।','Save your reference number to review this record after signing in.':'साइन इन के बाद रिकॉर्ड देखने के लिए संदर्भ संख्या सहेजें।','Complaint reference':'शिकायत संदर्भ संख्या','Submission Date':'जमा करने की तारीख','Status':'स्थिति','Submitted':'जमा किया गया','Under Review':'समीक्षा जारी','Assigned':'सौंपा गया','Investigation in Progress':'जाँच जारी','Resolved':'समाधान हुआ','Closed':'बंद','Rejected':'अस्वीकृत','Withdrawn':'वापस लिया गया','Print acknowledgement':'पावती प्रिंट करें','Track complaint':'शिकायत की स्थिति देखें','Dashboard':'डैशबोर्ड','Previous':'पिछला','Next':'आगे','Submitting...':'जमा हो रहा है...','Submit complaint':'शिकायत जमा करें','Map location is unavailable.':'मानचित्र सुविधा उपलब्ध नहीं है।'
};
const tr = (language, value) => language === 'hi' ? (HI[value] || value) : value;
const STATE_HI = {'Andhra Pradesh':'आंध्र प्रदेश','Assam':'असम','Bihar':'बिहार','Delhi':'दिल्ली','Goa':'गोवा','Gujarat':'गुजरात','Haryana':'हरियाणा','Himachal Pradesh':'हिमाचल प्रदेश','Jharkhand':'झारखंड','Karnataka':'कर्नाटक','Kerala':'केरल','Madhya Pradesh':'मध्य प्रदेश','Maharashtra':'महाराष्ट्र','Manipur':'मणिपुर','Meghalaya':'मेघालय','Mizoram':'मिज़ोरम','Nagaland':'नागालैंड','Odisha':'ओडिशा','Punjab':'पंजाब','Rajasthan':'राजस्थान','Sikkim':'सिक्किम','Tamil Nadu':'तमिलनाडु','Telangana':'तेलंगाना','Tripura':'त्रिपुरा','Uttar Pradesh':'उत्तर प्रदेश','Uttarakhand':'उत्तराखंड','West Bengal':'पश्चिम बंगाल'};
const TYPE_HI = {'Theft':'चोरी','Cyber Crime':'साइबर अपराध','Missing Person':'लापता व्यक्ति','Harassment':'उत्पीड़न','Assault':'हमला','Fraud':'धोखाधड़ी','Property Dispute':'संपत्ति विवाद','Other':'अन्य'};
const displayValue = (language, key, value) => language !== 'hi' ? value : key === 'State' ? (STATE_HI[value] || value) : key === 'Category' ? (TYPE_HI[value] || value) : value;

const STEPS = ['Personal Info', 'Incident Details', 'Location', 'Evidence', 'Review & Submit'];
const COMPLAINT_TYPES = ['Theft', 'Cyber Crime', 'Missing Person', 'Harassment', 'Assault', 'Fraud', 'Property Dispute', 'Other'];
const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const initForm = {
  complainantName: '', complainantMobile: '', complainantEmail: '', complainantAddress: '', complainantCity: '', complainantState: '',
  title: '', complaintType: '', subcategory: '', incidentDate: '', incidentTime: '', description: '',
  incidentLocation: '', incidentCity: '', incidentState: '', incidentPinCode: '',
  evidence: []
};

function validateStep(step, form, language) {
  const errs = {};
  if (step === 0) {
    if (!form.complainantName.trim()) errs.complainantName = 'Name is required';
    if (!form.complainantMobile || !/^\d{10}$/.test(form.complainantMobile)) errs.complainantMobile = 'Please enter a valid 10-digit mobile number';
    if (form.complainantEmail && !/\S+@\S+\.\S+/.test(form.complainantEmail)) errs.complainantEmail = 'Please enter a valid email address';
    if (!form.complainantCity.trim()) errs.complainantCity = 'City is required';
    if (!form.complainantState) errs.complainantState = 'State is required';
  }
  if (step === 1) {
    if (!form.title.trim()) errs.title = 'Complaint title is required';
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
  return Object.fromEntries(Object.entries(errs).map(([key, message]) => [key, tr(language, message)]));
}

export default function FileFIR() {
  const { language } = useLanguage();
  const [submissionKey] = useState(() => window.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const next = () => {
    const errs = validateStep(step, form, language);
    if (Object.keys(errs).length) return setErrors(errs);
    setStep(s => s + 1);
  };

  const handleFileUpload = (e) => {
    const chosen = Array.from(e.target.files);
    const allowed = chosen.filter(file => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type) && file.size <= 5 * 1024 * 1024);
    const remaining = Math.max(0, 5 - form.evidence.length);
    const files = allowed.slice(0, remaining).map(file => ({ name: file.name, type: file.type, size: file.size }));
    if (allowed.length !== chosen.length || files.length !== chosen.length) setApiError(tr(language, 'Preview only: choose up to 5 JPG, PNG, or PDF files, each no larger than 5 MB. File contents are not uploaded.'));
    else setApiError('');
    setForm(f => ({ ...f, evidence: [...f.evidence, ...files] }));
    e.target.value = '';
  };

  const removeFile = (i) => setForm(f => ({ ...f, evidence: f.evidence.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    if (!consent) return setApiError(tr(language, 'Please acknowledge the privacy notice before submitting.'));
    setLoading(true); setApiError('');
    try {
      const { data } = await submitFIR({ ...form, consent }, submissionKey);
      setSubmitted(data);
    } catch (err) {
      setApiError(tr(language, err.response?.data?.message || 'Submission failed. Please try again.'));
    } finally { setLoading(false); }
  };

  if (submitted) return <SuccessScreen fir={submitted} navigate={navigate} language={language} />;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ padding: '40px 0', background: '#f9fafb', flex: 1 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{tr(language, 'Submit a complaint')}</h1>
          <p style={{ color: '#6b7280', marginBottom: 10 }}>{tr(language, 'Complete all steps to submit your complaint.')}</p>
          <p className="alert alert-info" style={{ marginBottom: 20 }}>{tr(language, 'This is an independent complaint service, not an official FIR portal. Use fictional information only.')}</p>

          <div style={s.stepBar}>
            {STEPS.map((label, i) => (
              <div key={i} style={s.stepItem}>
                <div style={{ ...s.stepCircle, ...(i < step ? s.stepDone : i === step ? s.stepActive : s.stepPending) }}>
                  {i < step ? '✓' : String(i + 1).padStart(2, '0')}
                </div>
                <span style={{ ...s.stepLabel, color: i === step ? '#1a56db' : '#6b7280' }}>{tr(language, label)}</span>
                {i < STEPS.length - 1 && <div style={{ ...s.stepLine, background: i < step ? '#1a56db' : '#e5e7eb' }}></div>}
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <ErrorMessage message={apiError} />
            {step === 0 && <Step1 form={form} set={set} errors={errors} states={STATES} language={language} />}
            {step === 1 && <Step2 form={form} set={set} errors={errors} types={COMPLAINT_TYPES} language={language} />}
            {step === 2 && <Step3 form={form} set={set} errors={errors} states={STATES} language={language} />}
            {step === 3 && <Step4 form={form} onUpload={handleFileUpload} onRemove={removeFile} language={language} />}
            {step === 4 && <Step5 form={form} consent={consent} setConsent={setConsent} onEdit={setStep} language={language} />}

            <div style={s.navBtns}>
              {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← {tr(language, 'Previous')}</button>}
              <div style={{ flex: 1 }}></div>
              {step < 4 && <button className="btn btn-primary" onClick={next}>{tr(language, 'Next')} →</button>}
              {step === 4 && <button className="btn btn-success" onClick={handleSubmit} disabled={loading || !consent}>{loading ? tr(language, 'Submitting...') : tr(language, 'Submit complaint')}</button>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }) {
  const id = `complaint-${Array.from(label).map(char => char.codePointAt(0).toString(16)).join('-')}`;
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      {React.cloneElement(children, { id, 'aria-invalid': error ? 'true' : 'false', 'aria-describedby': error ? `${id}-error` : undefined })}
      {error && <div id={`${id}-error`} className="form-error">{error}</div>}
    </div>
  );
}

function Step1({ form, set, errors, states, language }) {
  return (
    <div>
      <h2 style={s.stepTitle}>{tr(language, 'Step 1 — Personal Information')}</h2>
      <div style={s.grid2}>
        <Field label={tr(language, 'Full Name *')} error={errors.complainantName}>
          <input className={`form-control ${errors.complainantName ? 'error' : ''}`} value={form.complainantName} onChange={e => set('complainantName', e.target.value)} placeholder={tr(language, 'Your full name')} />
        </Field>
        <Field label={tr(language, 'Mobile Number *')} error={errors.complainantMobile}>
          <input className={`form-control ${errors.complainantMobile ? 'error' : ''}`} value={form.complainantMobile} onChange={e => set('complainantMobile', e.target.value)} placeholder={tr(language, '10-digit mobile number')} />
        </Field>
      </div>
      <Field label={tr(language, 'Email Address')} error={errors.complainantEmail}>
        <input className={`form-control ${errors.complainantEmail ? 'error' : ''}`} type="email" value={form.complainantEmail} onChange={e => set('complainantEmail', e.target.value)} placeholder={tr(language, 'Optional')} />
      </Field>
      <Field label={tr(language, 'Address')}>
        <input className="form-control" value={form.complainantAddress} onChange={e => set('complainantAddress', e.target.value)} placeholder={tr(language, 'Your address')} />
      </Field>
      <div style={s.grid2}>
        <Field label={tr(language, 'City *')} error={errors.complainantCity}>
          <input className={`form-control ${errors.complainantCity ? 'error' : ''}`} value={form.complainantCity} onChange={e => set('complainantCity', e.target.value)} placeholder={tr(language, 'City')} />
        </Field>
        <Field label={tr(language, 'State *')} error={errors.complainantState}>
          <select className={`form-control ${errors.complainantState ? 'error' : ''}`} value={form.complainantState} onChange={e => set('complainantState', e.target.value)}>
            <option value="">{tr(language, 'Select State')}</option>
            {states.map(state => <option key={state} value={state}>{language === 'hi' ? (STATE_HI[state] || state) : state}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function Step2({ form, set, errors, types, language }) {
  return (
    <div>
      <h2 style={s.stepTitle}>{tr(language, 'Step 2 — Incident Details')}</h2>
      <Field label={tr(language, 'Complaint Title *')} error={errors.title}>
        <input className={`form-control ${errors.title ? 'error' : ''}`} maxLength={160} value={form.title} onChange={e => set('title', e.target.value)} placeholder={tr(language, 'Briefly summarize the issue')} />
      </Field>
      <Field label={tr(language, 'Type of Complaint *')} error={errors.complaintType}>
        <select className={`form-control ${errors.complaintType ? 'error' : ''}`} value={form.complaintType} onChange={e => set('complaintType', e.target.value)}>
          <option value="">{tr(language, 'Select complaint type')}</option>
          {types.map(type => <option key={type} value={type}>{language === 'hi' ? TYPE_HI[type] : type}</option>)}
        </select>
      </Field>
      <Field label={tr(language, 'Subcategory (optional)')}>
        <input className="form-control" maxLength={100} value={form.subcategory} onChange={e => set('subcategory', e.target.value)} placeholder={tr(language, 'Add a more specific category')} />
      </Field>
      <div style={s.grid2}>
        <Field label={tr(language, 'Date of Incident *')} error={errors.incidentDate}>
          <input className={`form-control ${errors.incidentDate ? 'error' : ''}`} type="date" value={form.incidentDate} onChange={e => set('incidentDate', e.target.value)} max={new Date().toISOString().split('T')[0]} />
        </Field>
        <Field label={tr(language, 'Time of Incident')}>
          <input className="form-control" type="time" value={form.incidentTime} onChange={e => set('incidentTime', e.target.value)} />
        </Field>
      </div>
      <Field label={tr(language, 'Description of Incident *')} error={errors.description}>
        <textarea className={`form-control ${errors.description ? 'error' : ''}`} rows={5} maxLength={10000} value={form.description} onChange={e => set('description', e.target.value)} placeholder={tr(language, 'Describe the incident in detail — what happened, who was involved, any witnesses, etc.')} style={{ minHeight: 140 }} />
      </Field>
      <p style={{ fontSize: 12, color: '#6b7280' }}>{tr(language, 'Characters: ')}{form.description.length}{tr(language, ' (minimum 20 required)')}</p>
    </div>
  );
}

function Step3({ form, set, errors, states, language }) {
  return (
    <div>
      <h2 style={s.stepTitle}>{tr(language, 'Step 3 — Incident Location')}</h2>
      <Field label={tr(language, 'Location / Address *')} error={errors.incidentLocation}>
        <input className={`form-control ${errors.incidentLocation ? 'error' : ''}`} value={form.incidentLocation} onChange={e => set('incidentLocation', e.target.value)} placeholder={tr(language, 'Where did the incident occur?')} />
      </Field>
      <div style={s.grid2}>
        <Field label={tr(language, 'City *')} error={errors.incidentCity}>
          <input className={`form-control ${errors.incidentCity ? 'error' : ''}`} value={form.incidentCity} onChange={e => set('incidentCity', e.target.value)} placeholder={tr(language, 'City')} />
        </Field>
        <Field label={tr(language, 'State *')} error={errors.incidentState}>
          <select className={`form-control ${errors.incidentState ? 'error' : ''}`} value={form.incidentState} onChange={e => set('incidentState', e.target.value)}>
            <option value="">{tr(language, 'Select State')}</option>
            {states.map(state => <option key={state} value={state}>{language === 'hi' ? (STATE_HI[state] || state) : state}</option>)}
          </select>
        </Field>
      </div>
      <Field label={tr(language, 'PIN Code')} error={errors.incidentPinCode}>
        <input className={`form-control ${errors.incidentPinCode ? 'error' : ''}`} value={form.incidentPinCode} onChange={e => set('incidentPinCode', e.target.value)} placeholder={tr(language, '6-digit PIN code')} maxLength={6} />
      </Field>
      <div style={s.mapPlaceholder}>
        <span style={{ fontSize: 32 }}>🗺️</span>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>{tr(language, 'Map location is unavailable.')}</p>
      </div>
    </div>
  );
}

function Step4({ form, onUpload, onRemove, language }) {
  return (
    <div>
      <h2 style={s.stepTitle}>{tr(language, 'Step 4 — Evidence (Optional)')}</h2>
      <div className="alert alert-info">⚠️ {tr(language, 'Do not upload unnecessary personal or sensitive documents.')}</div>
      <div style={s.uploadBox}>
        <span style={{ fontSize: 36 }}>📎</span>
        <p style={{ color: '#374151', fontWeight: 600, marginTop: 8 }}>{tr(language, 'Upload Supporting Documents')}</p>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }}>{tr(language, 'Preview up to 5 JPG, PNG, or PDF files (5 MB each). File contents are not uploaded or saved.')}</p>
        <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
          {tr(language, 'Choose Files')}
          <input type="file" multiple accept="image/jpeg,image/png,application/pdf" onChange={onUpload} className="visually-hidden" />
        </label>
      </div>
      {form.evidence.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{tr(language, 'Selected Files:')}</p>
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

function Step5({ form, consent, setConsent, onEdit, language }) {
  const sections = [
    { title: 'Personal Information', step: 0, fields: [['Name', form.complainantName], ['Mobile', form.complainantMobile], ['Email', form.complainantEmail || '—'], ['City', form.complainantCity], ['State', form.complainantState]] },
    { title: 'Incident Details', step: 1, fields: [['Title', form.title], ['Category', form.complaintType], ['Subcategory', form.subcategory || '—'], ['Date', form.incidentDate], ['Time', form.incidentTime || '—'], ['Description', form.description]] },
    { title: 'Location', step: 2, fields: [['Location', form.incidentLocation], ['City', form.incidentCity], ['State', form.incidentState], ['PIN Code', form.incidentPinCode || '—']] },
  ];
  return (
    <div>
      <h2 style={s.stepTitle}>{tr(language, 'Step 5 — Review & Submit')}</h2>
      <div className="alert alert-info">📋 {tr(language, 'Please verify that the information provided is correct before submitting.')}</div>
      {sections.map(sec => (
        <div key={sec.title} style={s.reviewSection}>
          <div style={s.reviewHeader}>
            <span style={{ fontWeight: 700, color: '#111827' }}>{tr(language, sec.title)}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(sec.step)}>{tr(language, 'Edit')}</button>
          </div>
          <div style={s.reviewGrid}>
            {sec.fields.map(([k, v]) => (
              <div key={k} style={s.reviewField}>
                <span style={s.reviewKey}>{tr(language, k)}</span>
                <span style={s.reviewVal}>{displayValue(language, k, v)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {form.evidence.length > 0 && (
        <div style={s.reviewSection}>
          <div style={s.reviewHeader}><span style={{ fontWeight: 700 }}>{tr(language, 'Evidence')}</span></div>
          <p style={{ fontSize: 14, color: '#374151' }}>{form.evidence.length}{tr(language, ' file(s) selected for preview. Contents are not sent to the server.')}</p>
        </div>
      )}
      <label className="privacy-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>{tr(language, 'This is an independent complaint service, not an official FIR portal. Use fictional information only.')}</span></label>
    </div>
  );
}

function SuccessScreen({ fir, navigate, language }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#f9fafb' }}>
        <div className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginBottom: 8 }}>{tr(language, 'Complaint submitted')}</h2>
          <p style={{ color: '#6b7280', marginBottom: 12 }}>{tr(language, 'This confirmation is not a legally registered FIR or an official filing receipt.')}</p>
          <p style={{ color: '#6b7280', marginBottom: 28 }}>{tr(language, 'Save your reference number to review this record after signing in.')}</p>
          <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{tr(language, 'Complaint reference')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', letterSpacing: 1 }}>{fir.referenceNumber}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28, textAlign: 'left' }}>
            {[['Submission Date', new Date(fir.submittedDate).toLocaleString()], ['Title', fir.title], ['Category', fir.complaintType], ['Status', fir.status]].map(([k, v]) => (
              <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>{tr(language, k)}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{k === 'Status' ? tr(language, v) : v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => window.print()}>{tr(language, 'Print acknowledgement')}</button>
            <button className="btn btn-primary" onClick={() => navigate('/track-fir')}>{tr(language, 'Track complaint')}</button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>{tr(language, 'Dashboard')}</button>
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
