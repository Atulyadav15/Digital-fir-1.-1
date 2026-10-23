const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const store = require('../data/store');

const router = express.Router();
const SECRET = process.env.JWT_SECRET;
function validPassword(password) {
  return typeof password === 'string' && password.length >= 10 && password.length <= 128;
}

router.post('/register', async (req, res) => {
  const { fullName, email, mobile, password, address } = req.body || {};
  const requiredFields = [fullName, email, mobile, password];
  const hasMissingField = requiredFields.some(
    value => typeof value !== 'string' || !value.trim()
  );

  if (hasMissingField) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  if (!validPassword(password)) {
    return res.status(400).json({ message: 'Password must be 10 to 128 characters.' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email.trim()) || !/^\d{10}$/.test(mobile.trim()))
    return res.status(400).json({ message: 'Enter a valid email address and 10-digit mobile number.' });

  const normalizedEmail = String(email).trim().toLowerCase();

  if (store.findUserByEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    fullName: fullName.trim().slice(0, 120),
    email: normalizedEmail,
    mobile: mobile.trim(),
    password: hashed,
    role: 'citizen',
    address: address || ''
  };
  store.addUser(user);

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '2h' });
  res.status(201).json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    }
  });
});

router.post('/reset-password', async (req, res) => {
  const { email, mobile, newPassword } = req.body || {};
  if (!email || !mobile || !newPassword)
    return res.status(400).json({ message: 'Email, mobile number, and new password are required' });
  if (!validPassword(newPassword))
    return res.status(400).json({ message: 'Password must be 10 to 128 characters.' });

  const user = store.findUserByEmail(email);
  if (!user || String(user.mobile).trim() !== String(mobile).trim())
    return res.status(400).json({ message: 'We could not verify those account details' });

  const hashed = await bcrypt.hash(newPassword, 10);
  store.updateUser(user.id, { password: hashed });
  res.json({ message: 'Password updated. You can now log in with your new password.' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = store.findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '2h' });
  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    }
  });
});

module.exports = router;
