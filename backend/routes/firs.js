const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

let firs = [
  {
    id: 'fir-001',
    referenceNumber: 'FIR-2024-001',
    userId: 'admin-001',
    complainantName: 'Rahul Sharma',
    complainantMobile: '9876543210',
    complainantEmail: 'rahul@example.com',
    complainantAddress: '123 MG Road',
    complainantCity: 'Mumbai',
    complainantState: 'Maharashtra',
    complaintType: 'Theft',
    incidentDate: '2024-01-15',
    incidentTime: '14:30',
    description: 'My laptop was stolen from the office.',
    incidentLocation: 'Office Building, Andheri',
    incidentCity: 'Mumbai',
    incidentState: 'Maharashtra',
    incidentPinCode: '400053',
    status: 'Under Review',
    policeStation: 'Andheri Police Station',
    assignedOfficer: '',
    remarks: '',
    submittedDate: '2024-01-16',
    lastUpdated: '2024-01-17',
    evidence: []
  }
];

const STATUSES = ['Submitted', 'Under Review', 'Assigned', 'Investigation in Progress', 'Resolved', 'Closed'];

router.post('/', authMiddleware, (req, res) => {
  const year = new Date().getFullYear();
  const yearFirs = firs.filter(f => f.referenceNumber.startsWith(`FIR-${year}-`));
  const refNum = `FIR-${year}-${String(yearFirs.length + 1).padStart(3, '0')}`;
  const fir = {
    id: uuidv4(),
    referenceNumber: refNum,
    userId: req.user.id,
    ...req.body,
    status: 'Submitted',
    policeStation: `${req.body.incidentCity || 'City'} Police Station`,
    assignedOfficer: '',
    remarks: '',
    submittedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    evidence: req.body.evidence || []
  };
  firs.push(fir);
  res.status(201).json(fir);
});

router.get('/track/:referenceNumber', (req, res) => {
  const fir = firs.find(f => f.referenceNumber === req.params.referenceNumber);
  if (!fir) return res.status(404).json({ message: 'FIR not found' });
  res.json(fir);
});

router.get('/', authMiddleware, (req, res) => {
  if (req.user.role === 'admin') return res.json(firs);
  res.json(firs.filter(f => f.userId === req.user.id));
});

router.get('/:id', authMiddleware, (req, res) => {
  const fir = firs.find(f => f.id === req.params.id);
  if (!fir) return res.status(404).json({ message: 'FIR not found' });
  if (req.user.role !== 'admin' && fir.userId !== req.user.id)
    return res.status(403).json({ message: 'Access denied' });
  res.json(fir);
});

router.put('/:id', authMiddleware, (req, res) => {
  const idx = firs.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'FIR not found' });
  firs[idx] = { ...firs[idx], ...req.body, lastUpdated: new Date().toISOString().split('T')[0] };
  res.json(firs[idx]);
});

router.put('/:id/status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const idx = firs.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'FIR not found' });
  const { status, assignedOfficer, remarks } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  firs[idx] = { ...firs[idx], status, assignedOfficer: assignedOfficer || firs[idx].assignedOfficer, remarks: remarks || firs[idx].remarks, lastUpdated: new Date().toISOString().split('T')[0] };
  res.json(firs[idx]);
});

router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  firs = firs.filter(f => f.id !== req.params.id);
  res.json({ message: 'FIR deleted' });
});

module.exports = router;
