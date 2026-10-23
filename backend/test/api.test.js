const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { createServer } = require('node:net');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const bcrypt = require('bcryptjs');

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(error => error ? reject(error) : resolve(port));
    });
  });
}

test('authentication, complaint ownership, tracking privacy and admin history', async t => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'digital-fir-test-'));
  const port = await freePort();
  const adminPassword = 'AdminDemoPassword!123';
  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify([{
    id: 'demo-admin', fullName: 'Demo Administrator', email: 'admin@example.test', mobile: '9999999999',
    password: bcrypt.hashSync(adminPassword, 4), role: 'admin', address: ''
  }]));
  fs.writeFileSync(path.join(dataDir, 'firs.json'), '[]');

  const child = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(port), JWT_SECRET: 'test-only-secret-that-is-longer-than-thirty-two-characters', CORS_ORIGINS: 'http://localhost:3000', DIGITAL_FIR_DATA_DIR: dataDir },
    stdio: 'ignore'
  });
  const base = `http://127.0.0.1:${port}/api`;
  t.after(() => {
    child.kill('SIGTERM');
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error('API process exited before startup.');
    try { await fetch(`${base}/firs`); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert.equal(ready, true, 'API starts');

  const request = async (url, { token, ...options } = {}) => {
    const response = await fetch(`${base}${url}`, {
      ...options,
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
    });
    return { status: response.status, body: await response.json() };
  };

  assert.equal((await request('/firs', { method: 'POST', body: '{}' })).status, 401);
  const registered = await request('/auth/register', { method: 'POST', body: JSON.stringify({ fullName: 'Citizen One', email: 'ONE@example.test', mobile: '9876543210', password: 'CitizenPass!123' }) });
  assert.equal(registered.status, 201);
  assert.equal(registered.body.user.email, 'one@example.test');
  assert.equal('password' in registered.body.user, false);

  const payload = { complainantName: 'Citizen One', complainantMobile: '9876543210', title: 'Fictional demo report', complaintType: 'Theft', subcategory: 'Property', consent: true, incidentDate: '2025-01-10', description: 'A fictional demo report with enough descriptive detail.', incidentLocation: 'Demo street', incidentCity: 'Pune', incidentState: 'Maharashtra' };
  const submitted = await request('/firs', { method: 'POST', token: registered.body.token, headers: { 'Idempotency-Key': 'submission-key-0001' }, body: JSON.stringify(payload) });
  assert.equal(submitted.status, 201);
  assert.match(submitted.body.referenceNumber, /^DEMO-\d{4}-\d{5}$/);
  const repeated = await request('/firs', { method: 'POST', token: registered.body.token, headers: { 'Idempotency-Key': 'submission-key-0001' }, body: JSON.stringify(payload) });
  assert.equal(repeated.status, 200);
  assert.equal(repeated.body.referenceNumber, submitted.body.referenceNumber);
  const secondSubmission = await request('/firs', { method: 'POST', token: registered.body.token, headers: { 'Idempotency-Key': 'submission-key-0002' }, body: JSON.stringify({ ...payload, title: 'Another fictional report' }) });
  assert.equal(secondSubmission.status, 201);
  assert.notEqual(secondSubmission.body.referenceNumber, submitted.body.referenceNumber);
  const initialNotifications = await request('/users/notifications', { token: registered.body.token });
  assert.equal(initialNotifications.body.length, 2);

  const otherUser = await request('/auth/register', { method: 'POST', body: JSON.stringify({ fullName: 'Citizen Two', email: 'two@example.test', mobile: '9876543211', password: 'CitizenPass!456' }) });
  assert.equal(otherUser.status, 201);
  assert.equal((await request(`/firs/${submitted.body.id}`, { token: otherUser.body.token })).status, 403);

  assert.equal((await request(`/firs/track/${submitted.body.referenceNumber}`)).status, 401);
  assert.equal((await request(`/firs/track/${submitted.body.referenceNumber}`, { token: otherUser.body.token })).status, 403);
  const tracked = await request(`/firs/track/${submitted.body.referenceNumber}`, { token: registered.body.token });
  assert.equal(tracked.status, 200);
  assert.equal('complainantName' in tracked.body, false);
  assert.equal('description' in tracked.body, false);
  assert.equal((await request(`/firs/${submitted.body.id}/status`, { method: 'PUT', token: registered.body.token, body: JSON.stringify({ status: 'Resolved' }) })).status, 403);

  const admin = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@example.test', password: adminPassword }) });
  assert.equal(admin.status, 200);
  assert.equal((await request(`/firs/${submitted.body.id}/status`, { method: 'PUT', token: admin.body.token, body: JSON.stringify({ status: 'Under Review' }) })).status, 400);
  const updated = await request(`/firs/${submitted.body.id}/status`, { method: 'PUT', token: admin.body.token, body: JSON.stringify({ status: 'Under Review', remarks: 'Fictional review note' }) });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.history.length, 2);

  const persisted = JSON.parse(fs.readFileSync(path.join(dataDir, 'firs.json'), 'utf8'))[0];
  assert.equal(persisted.status, 'Under Review');
  assert.equal(persisted.history.length, 2);
  assert.ok(persisted.history[1].at);
  const statusNotifications = await request('/users/notifications', { token: registered.body.token });
  assert.equal(statusNotifications.body.length, 3);
  assert.equal((await request(`/users/notifications/${statusNotifications.body[0].id}/read`, { method: 'PATCH', token: registered.body.token })).status, 200);
});
