const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'digital_fir_secret_key';

router.post('/register', async (req, res) => {
  const { fullName, email, mobile, password, address } = req.body;
  if (!fullName || !email || !mobile || !password)
    return res.status(400).json({ message: 'All fields are required' });

  if (store.findUserByEmail(email))
    return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    fullName,
    email,
    mobile,
    password: hashed,
    role: 'citizen',
    address: address || ''
  };
  store.addUser(user);

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, fullName, email, mobile, role: user.role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = store.findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, mobile: user.mobile, role: user.role } });
});

module.exports = router;
