const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(origin => origin.trim());
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin) || (process.env.VERCEL && origin.endsWith('.vercel.app'))) return callback(null, true);
  return callback(new Error('Origin is not allowed by CORS.'));
} }));
app.use(express.json({ limit: '1mb' }));

const windows = new Map();
app.use('/api/auth', (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const window = windows.get(key);
  if (!window || now - window.startedAt > 15 * 60 * 1000) windows.set(key, { startedAt: now, count: 1 });
  else window.count += 1;
  if (windows.get(key).count > 50) return res.status(429).json({ message: 'Too many authentication requests. Try again later.' });
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/firs', require('./routes/firs'));
app.use('/api/users', require('./routes/users'));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request body is too large.' });
  console.error('Request failed:', err.message);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

// Port 5000 is used by macOS Control Center on some machines.
const PORT = process.env.PORT || 5001;
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Set JWT_SECRET to a random value of at least 32 characters in backend/.env');
}
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
