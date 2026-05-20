import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaWhatsapp, FaFileAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import api from '../api';

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    hospital_name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildMessage = () => {
    let msg = 'QUOTE REQUEST\n\n';
    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} x${item.qty}`;
      if (item.price) msg += ` - NRS ${(item.price * item.qty).toLocaleString()}`;
      msg += '\n';
    });
    if (form.notes.trim()) {
      msg += `\nAdditional Notes: ${form.notes.trim()}`;
    }
    return msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    try {
      // Save each cart item as a quote to DB
      await Promise.all(cart.map(item =>
        api.post('/quotes', {
          productName: item.name,
          productSlug: item.slug,
          name: form.name.trim(),
          hospitalName: form.hospital_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: form.notes.trim() || `Order from cart — Qty: ${item.qty}`,
          qty: item.qty,
          source: 'cart',
        }).catch(() => {})
      ));
      // Send to WhatsApp
      const waMsg = encodeURIComponent(
        `*🛒 New Order — Meditrust Nepal*\n\n${buildMessage()}\n\nName: ${form.name.trim()}\nHospital: ${form.hospital_name.trim() || 'N/A'}\nPhone: ${form.phone.trim()}\nEmail: ${form.email.trim()}${form.notes.trim() ? `\nNotes: ${form.notes.trim()}` : ''}`
      );
      window.open(`https://wa.me/9779818100515?text=${waMsg}`, '_blank');
      toast.success('Order placed! We will contact you to confirm.');
      clearCart();
      setForm({ name: '', hospital_name: '', phone: '', email: '', notes: '' });
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return '';
    let msg = `${t('Checkout_Msg')}\n\n`;
    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} - Qty: ${item.qty}`;
      if (item.price) msg += ` - NRS ${(item.price * item.qty).toLocaleString()}`;
      msg += '\n';
    });
    if (cartTotal > 0) msg += `\n${t('Total')}: NRS ${cartTotal.toLocaleString()}`;
    msg += `\n\n${t('My_Details')}:`;
    msg += `\n- ${t('Contact_Number')}: `;
    msg += `\n- ${t('Location')}: `;
    msg += '\n\nPlease confirm availability and delivery details.';
    return encodeURIComponent(msg);
  };

  return (
    <>
      <SeoHead
        title="Quote Builder — Request Medical Equipment Quotation"
        description="Request a quotation for medical equipment from Meditrust Nepal. Add products to your quote list and submit for a fast, no-obligation price estimate."
        noindex={true}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quote Builder</h1>
          <p className="text-primary-200 mt-1.5 text-sm sm:text-base">Add items and submit a single inquiry</p>
        </div>
      </section>

      <section className="py-6 sm:py-12 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border mx-1">
              <FaShoppingCart className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">Browse our products and add items to request a quote.</p>
              <Link to="/products" className="btn-primary inline-block">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Selected Items ({cart.reduce((s, i) => s + i.qty, 0)})
                </h2>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border p-3 sm:p-4"
                  >
                    {/* Mobile-friendly card layout */}
                    <div className="flex gap-3 sm:gap-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Top row: name + remove */}
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/products/${item.id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 text-sm sm:text-base line-clamp-2 block leading-snug"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0 transition-colors"
                            aria-label="Remove item"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>

                        {/* Unit price */}
                        {item.price && (
                          <p className="text-primary-700 font-semibold text-xs sm:text-sm mt-1">
                            NRS {item.price.toLocaleString()} each
                          </p>
                        )}

                        {/* Bottom row: qty controls + line total */}
                        <div className="flex items-center justify-between mt-2.5 sm:mt-3">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <FaMinus className="text-[10px]" />
                            </button>
                            <span className="w-7 sm:w-8 text-center font-semibold text-sm text-gray-900 dark:text-white">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                              aria-label="Increase quantity"
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>

                          {/* Line total */}
                          {item.price && (
                            <p className="font-bold text-gray-900 text-sm sm:text-base">
                              NRS {(item.price * item.qty).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cart total on mobile (shows above form) */}
                {cartTotal > 0 && (
                  <div className="lg:hidden bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border px-4 py-3 flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-sm">Estimated Total</span>
                    <span className="text-primary-700 font-bold text-lg">NRS {cartTotal.toLocaleString()}</span>
                  </div>
                )}

                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-medium mt-1 flex items-center gap-1.5"
                >
                  <FaTrash className="text-xs" /> Clear All Items
                </button>
              </div>

              {/* Right: Contact / Quote Form */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border p-4 sm:p-6 lg:sticky lg:top-24">
                  <div className="flex items-center gap-2 mb-4 sm:mb-5">
                    <FaFileAlt className="text-primary-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Your Contact Details</h3>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>

                    {/* Hospital */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hospital / Clinic Name
                      </label>
                      <input
                        type="text"
                        name="hospital_name"
                        value={form.hospital_name}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>

                    {/* Phone + Email side by side on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          placeholder="98XXXXXXXX"
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@example.com"
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Delivery location, urgency, special requirements..."
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Place Order & Send via WhatsApp'
                      )}
                    </button>
                  </form>

                  {/* WhatsApp secondary action */}
                  <div className="mt-3">
                    <a
                      href={`https://wa.me/9779818100515?text=${generateWhatsAppMessage()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <FaWhatsapp className="text-base" /> {t('Order_Via_WhatsApp')}
                    </a>
                  </div>

                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Prices may vary. Final pricing will be confirmed after placing the order.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;
