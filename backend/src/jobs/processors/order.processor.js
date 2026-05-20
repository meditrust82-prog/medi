/**
 * Order job processor (BullMQ worker)
 *
 * Handles: post-order-creation side effects
 *   - Send confirmation email
 *   - Notify admin via Telegram/WhatsApp
 *   - Update analytics
 */
const processOrderConfirmation = async (job) => {
  const { orderId, userEmail, totalPrice } = job.data;
  console.log(`[OrderProcessor] Processing order ${orderId} for ${userEmail}`);
  // TODO: call email service, notification service, etc.
};

module.exports = { processOrderConfirmation };
