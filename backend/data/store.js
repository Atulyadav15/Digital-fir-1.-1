const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DIGITAL_FIR_DATA_DIR || __dirname;
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const FIRS_FILE = path.join(DATA_DIR, 'firs.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

function readJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ── Seed default admin if users file doesn't exist yet ───────────────────────

if (!fs.existsSync(USERS_FILE)) {
  writeJSON(USERS_FILE, [
    {
      id: 'admin-001',
      fullName: 'Admin Officer',
      email: 'admin@digitalfir.gov',
      mobile: '9999999999',
      // bcrypt hash of 'password'
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      role: 'admin',
      address: 'Police HQ, New Delhi'
    }
  ]);
}

if (!fs.existsSync(FIRS_FILE)) {
  writeJSON(FIRS_FILE, [
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
  ]);
}

// ── Public API ────────────────────────────────────────────────────────────────

const store = {
  // ── Users ──
  getUsers() {
    return readJSON(USERS_FILE, []);
  },
  saveUsers(users) {
    writeJSON(USERS_FILE, users);
  },
  findUserByEmail(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    return this.getUsers().find(u => String(u.email || '').trim().toLowerCase() === normalizedEmail) || null;
  },
  findUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    return users[idx];
  },

  // ── FIRs ──
  getFIRs() {
    return readJSON(FIRS_FILE, []);
  },
  saveFIRs(firs) {
    writeJSON(FIRS_FILE, firs);
  },
  findFIRById(id) {
    return this.getFIRs().find(f => f.id === id) || null;
  },
  findFIRByRef(referenceNumber) {
    return this.getFIRs().find(f => f.referenceNumber === referenceNumber) || null;
  },
  addFIR(fir) {
    const firs = this.getFIRs();
    firs.push(fir);
    this.saveFIRs(firs);
  },
  updateFIR(id, updates) {
    const firs = this.getFIRs();
    const idx = firs.findIndex(f => f.id === id);
    if (idx === -1) return null;
    firs[idx] = { ...firs[idx], ...updates };
    this.saveFIRs(firs);
    return firs[idx];
  },
  deleteFIR(id) {
    const firs = this.getFIRs().filter(f => f.id !== id);
    this.saveFIRs(firs);
  },
  countFIRsByYear(year) {
    return this.getFIRs().filter(f => f.referenceNumber.startsWith(`DEMO-${year}-`)).length;
  }
};

module.exports = store;
