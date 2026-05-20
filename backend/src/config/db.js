const mongoose = require('mongoose');

// ─── Transaction support probe ────────────────────────────────────────────────────────

const checkTransactionSupport = async () => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await session.abortTransaction();
    session.endSession();
    process.env._MONGO_TRANSACTIONS = 'true';
    console.log(JSON.stringify({ ts: new Date().toISOString(), event: 'db.transactions_supported' }));
  } catch {
    process.env._MONGO_TRANSACTIONS = 'false';
    const level = process.env.NODE_ENV === 'production' ? 'CRITICAL' : 'WARNING';
    console.error(JSON.stringify({
      ts: new Date().toISOString(),
      event: 'db.transactions_unsupported',
      level,
      message: 'Atlas M0/M2/M5 detected. Order creation disabled. Upgrade to M10+ for production.',
    }));
  }
};

// ─── Connection event listeners ────────────────────────────────────────────────────

const attachConnectionListeners = () => {
  const conn = mongoose.connection;

  conn.on('disconnected', () =>
    console.error(JSON.stringify({ ts: new Date().toISOString(), event: 'db.disconnected' }))
  );
  conn.on('reconnected', () =>
    console.log(JSON.stringify({ ts: new Date().toISOString(), event: 'db.reconnected' }))
  );
  conn.on('error', (err) =>
    console.error(JSON.stringify({ ts: new Date().toISOString(), event: 'db.error', message: err.message }))
  );
};

// ─── Connect ────────────────────────────────────────────────────────────────────────

const connectDB = async () => {
  attachConnectionListeners();

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10_000,  // fail fast if Atlas unreachable
    socketTimeoutMS:          45_000,  // drop idle sockets after 45s
    maxPoolSize:              10,       // max concurrent DB connections
    minPoolSize:              2,        // keep 2 connections warm
  });

  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    event: 'db.connected',
    host: mongoose.connection.host,
  }));

  await checkTransactionSupport();
};

module.exports = connectDB;
