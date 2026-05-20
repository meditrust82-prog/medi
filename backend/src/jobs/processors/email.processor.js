/**
 * Email job processor (BullMQ worker)
 *
 * Handles: transactional email delivery
 *   - Order confirmation
 *   - Password reset
 *   - Shipping update
 */
const processSendEmail = async (job) => {
  const { to, subject, body } = job.data;
  console.log(`[EmailProcessor] Sending "${subject}" to ${to}`);
  // TODO: integrate Nodemailer / SendGrid / AWS SES
};

module.exports = { processSendEmail };
