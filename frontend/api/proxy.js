/**
 * BFF (Backend-For-Frontend) SSR Proxy
 * Uses the internal service binding URL from process.env.BACKEND_URL
 * to forward /api/* requests to the internal backend service.
 */
module.exports = async function handler(req, res) {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:5001';
  const targetUrl = new URL(req.url, backendBase);

  const headers = {};
  for (const [key, val] of Object.entries(req.headers || {})) {
    const lower = key.toLowerCase();
    if (lower !== 'host' && lower !== 'connection' && lower !== 'content-length') {
      headers[key] = val;
    }
  }

  const options = {
    method: req.method,
    headers,
  };

  const method = (req.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (req.body) {
      options.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      headers['content-type'] = headers['content-type'] || 'application/json';
    }
  }

  try {
    const upstream = await fetch(targetUrl, options);

    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });

    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await upstream.json();
      return res.json(data);
    } else {
      const text = await upstream.text();
      return res.send(text);
    }
  } catch (err) {
    console.error('BFF proxy error calling internal backend:', err);
    return res.status(502).json({
      message: 'Failed to communicate with internal backend service.',
      error: err.message
    });
  }
};
