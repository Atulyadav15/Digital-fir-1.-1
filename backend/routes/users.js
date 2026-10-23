const express = require('express');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');
const store = require('../data/store');
const { addNotification } = require('../services/notificationService');

const router = express.Router();

router.get('/notifications', authMiddleware, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json((user.notifications || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.patch('/notifications/:notificationId/read', authMiddleware, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const notifications = user.notifications || [];
  const notificationExists = notifications.some(
    item => item.id === req.params.notificationId
  );
  if (!notificationExists) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  const updatedNotifications = notifications.map(notification => {
    if (notification.id !== req.params.notificationId) return notification;
    return { ...notification, readAt: new Date().toISOString() };
  });

  store.updateUser(user.id, { notifications: updatedNotifications });
  res.json({ message: 'Notification marked as read.' });
});

router.get('/profile', authMiddleware, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = user;
  res.json(safe);
});

router.put('/profile', authMiddleware, (req, res) => {
  const { fullName, mobile, address } = req.body || {};
  if (
    fullName !== undefined &&
    (typeof fullName !== 'string' || !fullName.trim() || fullName.trim().length > 120)
  ) {
    return res.status(400).json({ message: 'Name must be between 1 and 120 characters.' });
  }
  if (mobile !== undefined && (typeof mobile !== 'string' || !/^\d{10}$/.test(mobile.trim()))) {
    return res.status(400).json({ message: 'Enter a valid 10-digit mobile number.' });
  }
  if (address !== undefined && (typeof address !== 'string' || address.length > 500)) {
    return res.status(400).json({ message: 'Address must be 500 characters or fewer.' });
  }

  const updated = store.updateUser(req.user.id, {
    ...(fullName !== undefined && { fullName: fullName.trim() }),
    ...(mobile !== undefined && { mobile: mobile.trim() }),
    ...(address !== undefined && { address })
  });
  if (!updated) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = updated;
  res.json(safe);
});

router.put('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 10 || newPassword.length > 128)
    return res.status(400).json({ message: 'Provide your current password and a new password of 10 to 128 characters.' });
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });

  const hashed = await bcrypt.hash(newPassword, 10);
  store.updateUser(req.user.id, { password: hashed });
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;
