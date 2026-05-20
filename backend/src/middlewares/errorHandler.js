const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  // ── Mongoose: invalid ObjectId (e.g. /orders/not-an-id) ──────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  // ── Mongoose: duplicate key ─────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const friendlyField = { slug: 'Product slug', email: 'Email', username: 'Username' }[field] || field;
    return res.status(409).json({ error: `${friendlyField} already exists — please use a different value.` });
  }

  // ── Mongoose: validation errors ──────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // ── JWT errors ─────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' });
  if (err.name === 'TokenExpiredError')  return res.status(401).json({ error: 'Token expired' });

  // ── Structured log (same format as audit() in order.service) ─────────────
  const status = err.status || err.statusCode || 500;
  const logEntry = {
    ts: new Date().toISOString(),
    event: 'http.error',
    status,
    method: req.method,
    path: req.path,
    message: err.message,
    ...(isProd ? {} : { stack: err.stack }),
  };
  if (status >= 500) console.error(JSON.stringify(logEntry));
  else console.warn(JSON.stringify(logEntry));

  // ── Response — never leak internals in production ─────────────────────────
  res.status(status).json({
    error: status >= 500 && isProd ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler;
