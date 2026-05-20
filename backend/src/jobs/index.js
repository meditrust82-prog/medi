/**
 * Job queue infrastructure — BullMQ-ready
 *
 * To activate:
 *   npm install bullmq ioredis
 *   Set REDIS_URL in .env
 *   Uncomment the BullMQ code below and remove the stub exports.
 */

// const { Queue, Worker } = require('bullmq');
// const { connection } = require('./connection');
// const { processOrderConfirmation } = require('./processors/order.processor');
// const { processSendEmail } = require('./processors/email.processor');

// export const orderQueue = new Queue('orders', { connection });
// export const emailQueue = new Queue('emails', { connection });

// new Worker('orders', processOrderConfirmation, { connection });
// new Worker('emails', processSendEmail, { connection });

const stub = {
  add: (name, data) => {
    console.log(`[Queue stub] Would enqueue job "${name}":`, data);
    return Promise.resolve();
  },
};

module.exports = { orderQueue: stub, emailQueue: stub };
