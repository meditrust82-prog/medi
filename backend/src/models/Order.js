const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  cost: { type: Number, default: 0 }, // snapshot at time of sale for profit calc
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'awaiting_payment', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    payment: {
      gateway:        { type: String, enum: ['khalti', null], default: null },
      paymentId:      { type: String, default: null },
      amount:         { type: Number, default: null },
      paidAt:         { type: Date,   default: null },
      // Set when order enters awaiting_payment; used for expired-payment cleanup
      expiresAt:      { type: Date,   default: null },
      // Idempotency key — Khalti pidx; prevents duplicate webhook processing
      webhookEventId: { type: String, default: null, index: true, sparse: true },
    },
    shippingAddress: {
      name: String,
      phone: String,
      addressLine: String,
      city: String,
      country: { type: String, default: 'Nepal' },
    },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
