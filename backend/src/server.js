require('dotenv').config();

// ─── Validate required env vars before any other imports ────────────────────────
const validateEnv = require('./config/validateEnv');
validateEnv();

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
const { expireStalePayments } = require('./services/order.service');
const { startQuoteCron } = require('./utils/quoteCron');

const PORT = process.env.PORT || 5050;
const EXPIRE_INTERVAL_MS = 10 * 60 * 1000;

// ─── Process-level safety net ───────────────────────────────────────────────────
// These catch bugs that slip past route error handlers.
// Log and exit so the process manager (Railway/PM2) can restart cleanly.
process.on('uncaughtException', (err) => {
  console.error(JSON.stringify({
    ts: new Date().toISOString(),
    event: 'process.uncaughtException',
    message: err.message,
    stack: err.stack,
  }));
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(JSON.stringify({
    ts: new Date().toISOString(),
    event: 'process.unhandledRejection',
    message: String(reason),
  }));
  process.exit(1);
});

// ─── Start ───────────────────────────────────────────────────────────────────
console.log('>> server.js starting, NODE_ENV=' + process.env.NODE_ENV);

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(JSON.stringify({
        ts: new Date().toISOString(),
        event: 'server.started',
        port: PORT,
        env: process.env.NODE_ENV,
      }));
    });

    // ── Graceful shutdown on SIGTERM (Railway / Docker stop) ─────────────
    // Stops accepting new connections, waits for in-flight requests to finish,
    // then closes the MongoDB connection cleanly.
    process.on('SIGTERM', () => {
      console.log(JSON.stringify({ ts: new Date().toISOString(), event: 'server.shutdown_start' }));
      server.close(async () => {
        try {
          await mongoose.connection.close();
          console.log(JSON.stringify({ ts: new Date().toISOString(), event: 'server.shutdown_complete' }));
        } catch (err) {
          console.error(JSON.stringify({ ts: new Date().toISOString(), event: 'server.shutdown_error', message: err.message }));
        }
        process.exit(0);
      });
    });

    // ── Quote follow-up reminder cron ────────────────────────────────
    startQuoteCron();

    // ── Expired payment cleanup ───────────────────────────────────────
    // Random jitter (0–60s) staggers multi-instance deployments.
    // updateMany is idempotent — concurrent runs are safe.
    const jitter = Math.floor(Math.random() * 60_000);
    setTimeout(() => {
      expireStalePayments(30).catch((err) =>
        console.error(JSON.stringify({ ts: new Date().toISOString(), event: 'expiry.error', message: err.message }))
      );
      setInterval(async () => {
        try { await expireStalePayments(30); }
        catch (err) {
          console.error(JSON.stringify({ ts: new Date().toISOString(), event: 'expiry.error', message: err.message }));
        }
      }, EXPIRE_INTERVAL_MS);
    }, jitter);
  })
  .catch((err) => {
    console.error(JSON.stringify({
      ts: new Date().toISOString(),
      event: 'db.connect_failed',
      message: err.message,
    }));
    process.exit(1);
  });
