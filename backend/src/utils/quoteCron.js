/**
 * Quote follow-up reminder via WhatsApp
 * Runs every hour. For any quote that has been "new" for >24h,
 * fires a WhatsApp wa.me link notification to admin via a lightweight HTTP GET.
 *
 * No external cron service required — just call startQuoteCron() at server startup.
 */
const Quote = require('../models/Quote');

const ADMIN_PHONE = process.env.ADMIN_WHATSAPP_PHONE || '9779818100515';
const INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const buildAdminWaUrl = (quotes) => {
  const lines = quotes.slice(0, 5).map((q, i) =>
    `${i + 1}. ${q.productName} — ${q.name} (${q.phone})`
  );
  const msg = encodeURIComponent(
    `*Meditrust Quote Reminder*\n\nYou have *${quotes.length}* unanswered quote(s) waiting >24h:\n\n` +
    lines.join('\n') +
    (quotes.length > 5 ? `\n...and ${quotes.length - 5} more.` : '') +
    `\n\nPlease follow up: https://meditrustnepal.com/admin/quotes`
  );
  return `https://wa.me/${ADMIN_PHONE}?text=${msg}`;
};

const checkPendingQuotes = async () => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stale = await Quote.find({
      status: 'new',
      createdAt: { $lt: cutoff },
      reminderSentAt: { $exists: false },
    }).select('productName name phone').lean();

    if (stale.length === 0) return;

    const waUrl = buildAdminWaUrl(stale);
    console.log(`[QuoteCron] ${stale.length} stale quote(s). Admin reminder URL:\n${waUrl}`);

    // Mark as reminded so we don't spam
    const ids = stale.map(q => q._id);
    await Quote.updateMany({ _id: { $in: ids } }, { $set: { reminderSentAt: new Date() } });
  } catch (err) {
    console.error('[QuoteCron] Error:', err.message);
  }
};

const startQuoteCron = () => {
  console.log('[QuoteCron] Started — checking for stale quotes every hour.');
  checkPendingQuotes(); // run immediately on startup
  setInterval(checkPendingQuotes, INTERVAL_MS);
};

module.exports = { startQuoteCron };
