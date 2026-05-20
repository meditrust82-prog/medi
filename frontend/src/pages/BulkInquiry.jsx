import React, { useState } from 'react';
import SeoHead from '../components/SeoHead';
import { FaPlus, FaTrash, FaWhatsapp, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const emptyRow = () => ({ id: Date.now() + Math.random(), name: '', qty: 1, notes: '' });

const BulkInquiry = () => {
  const [items, setItems] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [contact, setContact] = useState({ name: '', hospital: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const updateItem = (id, field, value) =>
    setItems(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const addRow = () => setItems(prev => [...prev, emptyRow()]);
  const removeRow = (id) => setItems(prev => prev.filter(r => r.id !== id));

  const filledItems = items.filter(r => r.name.trim());

  const buildWAMessage = () => {
    const lines = [
      `*Bulk Equipment Inquiry — Meditrust Nepal*`,
      ``,
      `*Contact Details:*`,
      `Name: ${contact.name}`,
      `Hospital/Organization: ${contact.hospital || 'N/A'}`,
      `Phone: ${contact.phone}`,
      `Email: ${contact.email || 'N/A'}`,
      ``,
      `*Required Equipment (${filledItems.length} items):*`,
      ...filledItems.map((r, i) => `${i + 1}. ${r.name} — Qty: ${r.qty}${r.notes ? ` (${r.notes})` : ''}`),
      ``,
      `Please provide a consolidated quotation.`,
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact.name || !contact.phone) { toast.error('Please fill in your name and phone number'); return; }
    if (filledItems.length === 0) { toast.error('Please add at least one item'); return; }
    window.open(`https://wa.me/9779818100515?text=${buildWAMessage()}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-24 text-center bg-[var(--bg-secondary)] min-h-screen">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Inquiry Sent!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Your bulk inquiry has been sent via WhatsApp. Our team will respond within 24 hours.</p>
        <div className="flex justify-center gap-4">
          <Link to="/products" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition">Browse More Products</Link>
          <button onClick={() => { setSubmitted(false); setItems([emptyRow(), emptyRow(), emptyRow()]); }} className="border border-gray-300 dark:border-dark-border px-6 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-card transition">New Inquiry</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <SeoHead
        title="Bulk Equipment Inquiry — Hospital Procurement | Meditrust Nepal"
        description="Submit a bulk medical equipment inquiry for your hospital or clinic. Get a consolidated quotation for multiple items from Meditrust Nepal."
        canonical="/bulk-inquiry"
      />

      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/products" className="inline-flex items-center text-primary-200 hover:text-white mb-4 text-sm transition">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-white">Hospital Bulk Inquiry</h1>
          <p className="text-primary-200 mt-2">List all equipment you need — we'll send you one consolidated quote.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10 bg-[var(--bg-secondary)] min-h-[70vh]">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Contact details */}
          <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Your Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name *', field: 'name', placeholder: 'Dr. Ram Sharma', required: true },
                { label: 'Hospital / Organization', field: 'hospital', placeholder: 'Bir Hospital, Kathmandu' },
                { label: 'Phone Number *', field: 'phone', placeholder: '+977-98XXXXXXXX', required: true },
                { label: 'Email Address', field: 'email', placeholder: 'procurement@hospital.com' },
              ].map(({ label, field, placeholder, required }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input
                    type="text"
                    value={contact[field]}
                    onChange={e => setContact(c => ({ ...c, [field]: e.target.value }))}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Item list */}
          <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Equipment List</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500">{filledItems.length} item{filledItems.length !== 1 ? 's' : ''} added</span>
            </div>

            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 px-1">
              <div className="col-span-6">Equipment Name</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3">Notes / Specs</div>
              <div className="col-span-1" />
            </div>

            <div className="space-y-2">
              {items.map((row, idx) => (
                <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      type="text"
                      value={row.name}
                      onChange={e => updateItem(row.id, 'name', e.target.value)}
                      placeholder={`Item ${idx + 1} — e.g. ICU Ventilator`}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={e => updateItem(row.id, 'qty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm text-center bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div className="col-span-7 sm:col-span-3">
                    <input
                      type="text"
                      value={row.notes}
                      onChange={e => updateItem(row.id, 'notes', e.target.value)}
                      placeholder="Brand, spec, budget..."
                      className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 p-1 transition">
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="mt-4 flex items-center gap-2 text-primary-600 text-sm font-semibold hover:text-primary-700 transition"
            >
              <FaPlus className="text-xs" /> Add another item
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-3 bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-md"
            >
              <FaWhatsapp className="text-xl" /> Send Bulk Inquiry via WhatsApp
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Submitting opens WhatsApp with your inquiry pre-filled. Our team responds within 24 hours.
          </p>
        </form>
      </section>
    </>
  );
};

export default BulkInquiry;
