const express = require('express');
const { randomUUID } = require('crypto');
const authMiddleware = require('../middleware/auth');
const store = require('../data/store');
const { addNotification } = require('../services/notificationService');

const router = express.Router();
const STATUSES = [
  'Submitted',
  'Under Review',
  'Assigned',
  'Investigation in Progress',
  'Resolved',
  'Closed',
  'Rejected',
  'Withdrawn'
];
const CATEGORIES = [
  'Theft',
  'Cyber Crime',
  'Missing Person',
  'Harassment',
  'Assault',
  'Fraud',
  'Property Dispute',
  'Other'
];
const text = (value, max = 2000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

router.post('/', authMiddleware, (req, res) => {
  const body = req.body || {};
  const idempotencyKey = text(req.get('Idempotency-Key'), 80);
  if (idempotencyKey && !/^[a-zA-Z0-9_-]{16,80}$/.test(idempotencyKey)) {
    return res.status(400).json({ message: 'Invalid submission key.' });
  }

  if (idempotencyKey) {
    const existing = store.getFIRs().find(
      item => item.userId === req.user.id && item.idempotencyKey === idempotencyKey
    );
    if (existing) return res.status(200).json(existing);
  }
  const requiredFields = [
    'complainantName',
    'complainantMobile',
    'title',
    'complaintType',
    'incidentDate',
    'description',
    'incidentLocation',
    'incidentCity',
    'incidentState'
  ];
  if (requiredFields.some(key => !text(body[key]))) {
    return res.status(400).json({ message: 'Complete all required complaint fields.' });
  }
  if (!/^\d{10}$/.test(text(body.complainantMobile))) {
    return res.status(400).json({ message: 'Enter a valid 10-digit mobile number.' });
  }
  if (text(body.title).length < 3 || body.title.length > 160) {
    return res.status(400).json({ message: 'Complaint title must be between 3 and 160 characters.' });
  }
  if (text(body.subcategory).length > 100) {
    return res.status(400).json({ message: 'Subcategory must be 100 characters or fewer.' });
  }
  if (!CATEGORIES.includes(text(body.complaintType, 80))) {
    return res.status(400).json({ message: 'Select a valid complaint category.' });
  }
  if (body.consent !== true) {
    return res.status(400).json({ message: 'Please acknowledge the demo privacy notice.' });
  }
  if (
    typeof body.description !== 'string' ||
    body.description.trim().length < 20 ||
    body.description.length > 10000
  ) {
    return res.status(400).json({
      message: 'Description must be between 20 and 10,000 characters.'
    });
  }
  if (Number.isNaN(Date.parse(body.incidentDate)) || new Date(body.incidentDate) > new Date()) {
    return res.status(400).json({ message: 'Enter a valid incident date.' });
  }

  const year = new Date().getFullYear();
  const sequence = store.countFIRsByYear(year) + 1;
  const now = new Date().toISOString();
  const fir = {
    id: randomUUID(),
    referenceNumber: `DEMO-${year}-${String(sequence).padStart(5, '0')}`,
    userId: req.user.id,
    ...(idempotencyKey ? { idempotencyKey } : {}),
    complainantName: text(body.complainantName, 120),
    complainantMobile: text(body.complainantMobile, 10),
    complainantEmail: text(body.complainantEmail, 200),
    complainantAddress: text(body.complainantAddress, 500),
    complainantCity: text(body.complainantCity, 100),
    complainantState: text(body.complainantState, 100),
    title: text(body.title),
    complaintType: text(body.complaintType, 80),
    subcategory: text(body.subcategory, 100),
    incidentDate: text(body.incidentDate, 30),
    incidentTime: text(body.incidentTime, 10),
    description: body.description,
    incidentLocation: text(body.incidentLocation, 500),
    incidentCity: text(body.incidentCity, 100),
    incidentState: text(body.incidentState, 100),
    incidentPinCode: text(body.incidentPinCode, 6),
    status: 'Submitted', policeStation: 'Demo record', assignedOfficer: '', remarks: '',
    submittedDate: now, lastUpdated: now, consentAt: now, evidence: [],
    history: [{ status: 'Submitted', note: 'Complaint received by the demonstration system.', at: now }]
  };
  store.addFIR(fir);
  addNotification(req.user.id, {
    kind: 'notification.submitted',
    complaintId: fir.id,
    referenceNumber: fir.referenceNumber,
    status: fir.status
  });
  res.status(201).json(fir);
});

// Tracking is intentionally limited to status metadata; the reference number is not an authorization credential.
router.get('/track/:referenceNumber', authMiddleware, (req, res) => {
  const fir = store.findFIRByRef(text(req.params.referenceNumber, 40).toUpperCase());
  if (!fir) return res.status(404).json({ message: 'Complaint not found.' });
  if (req.user.role !== 'admin' && fir.userId !== req.user.id) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  res.json({
    referenceNumber: fir.referenceNumber,
    complaintType: fir.complaintType,
    status: fir.status,
    submittedDate: fir.submittedDate,
    lastUpdated: fir.lastUpdated,
    assignedOfficer: fir.assignedOfficer || '',
    history: (fir.history || []).map(({ status, at, note }) => ({ status, at, note }))
  });
});

router.get('/', authMiddleware, (req, res) => {
  const all = store.getFIRs();
  const mine = req.user.role === 'admin' ? all : all.filter(f => f.userId === req.user.id);
  res.json(mine.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)));
});

router.get('/:id', authMiddleware, (req, res) => {
  const fir = store.findFIRById(req.params.id);
  if (!fir) return res.status(404).json({ message: 'Complaint not found.' });
  if (req.user.role !== 'admin' && fir.userId !== req.user.id) {
    return res.status(403).json({ message: 'Access denied.' });
  }
  res.json(fir);
});

router.put('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  return res.status(405).json({ message: 'Use the status update endpoint.' });
});

router.put('/:id/status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  const fir = store.findFIRById(req.params.id);
  if (!fir) return res.status(404).json({ message: 'Complaint not found.' });
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  if (!text(req.body?.remarks, 1000)) {
    return res.status(400).json({ message: 'A status update note is required.' });
  }
  const at = new Date().toISOString();
  const note = text(req.body.remarks, 1000);
  const updated = store.updateFIR(fir.id, {
    status,
    assignedOfficer: text(req.body.assignedOfficer, 120) || fir.assignedOfficer,
    remarks: note || fir.remarks,
    lastUpdated: at,
    history: [...(fir.history || []), { status, note: note || 'Status updated by demo administrator.', at }]
  });
  addNotification(fir.userId, {
    kind: 'notification.statusChanged',
    complaintId: fir.id,
    referenceNumber: fir.referenceNumber,
    status
  });
  res.json(updated);
});

router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  if (!store.findFIRById(req.params.id)) return res.status(404).json({ message: 'Complaint not found.' });
  store.deleteFIR(req.params.id);
  res.json({ message: 'Demo complaint deleted.' });
});

module.exports = router;
