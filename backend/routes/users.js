const express = require('express');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');
const store = require('../data/store');

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = user;
  res.json(safe);
});

router.put('/profile', authMiddleware, (req, res) => {
  const { fullName, mobile, address } = req.body;
  const updated = store.updateUser(req.user.id, {
    ...(fullName && { fullName }),
    ...(mobile && { mobile }),
    ...(address !== undefined && { address })
  });
  if (!updated) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = updated;
  res.json(safe);
});

router.put('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });

  const hashed = await bcrypt.hash(newPassword, 10);
  store.updateUser(req.user.id, { password: hashed });
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;
