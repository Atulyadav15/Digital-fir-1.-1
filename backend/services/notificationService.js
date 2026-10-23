const { randomUUID } = require('crypto');
const store = require('../data/store');

function addNotification(userId, notification) {
  const user = store.findUserById(userId);
  if (!user) return;
  const item = { id: randomUUID(), ...notification, createdAt: new Date().toISOString(), readAt: null };
  store.updateUser(userId, { notifications: [...(user.notifications || []), item].slice(-100) });
}

module.exports = { addNotification };
