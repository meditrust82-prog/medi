import React, { useState } from 'react';
import SeoHead from '../components/SeoHead';
import api from '../api';
import { FaSearch, FaCheckCircle, FaPhone } from 'react-icons/fa';

const STATUS_INFO = {
  new:       { label: 'Received',   color: 'bg-blue-100 text-blue-700',   desc: 'Your quote request has been received. Our team will contact you shortly.' },
  contacted: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', desc: 'Our team has reviewed your request and is preparing your quotation.' },
  converted: { label: 'Completed',  color: 'bg-green-100 text-green-700',  desc: 'Your quotation has been sent. Please check your WhatsApp or call us.' },
  lost:      { label: 'Closed',     color: 'bg-gray-100 text-gray-600',    desc: 'This inquiry has been closed. Please contact us if you need further assistance.' },
};

export default function QuoteStatusPage() {
  const [phone, setPhone] = useState('');
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    setQuotes(null);
    try {
      const res = await api.get('/quotes/my', { params: { phone: phone.trim() } });
      setQuotes(res.data.quotes || []);
    } catch {
      setError('Could not find any quotes for that phone number. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead title="Track My Quote — Meditrust Nepal" noindex={true} />

      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Quote</h1>
          <p className="text-primary-200">Enter your phone number to see the status of your quotation requests</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-12 bg-[var(--bg-secondary)] min-h-[60vh]">
        <form onSubmit={handleSearch} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number Used When Requesting a Quote</label>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-60">
              <FaSearch /> {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm mb-4">{error}</div>
        )}

        {quotes !== null && quotes.length === 0 && !error && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">No quotes found for that phone number.</div>
        )}

        {quotes && quotes.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{quotes.length} quote{quotes.length !== 1 ? 's' : ''} found</p>
            {quotes.map(q => {
              const info = STATUS_INFO[q.status] || STATUS_INFO.new;
              return (
                <div key={q._id} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{q.productName}</p>
                      {q.hospitalName && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{q.hospitalName}</p>}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${info.color}`}>{info.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{info.desc}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Submitted: {new Date(q.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              );
            })}

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-2xl p-5 flex items-start gap-4 mt-6">
              <FaPhone className="text-primary-600 dark:text-brand-cyan mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Need faster updates?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Call or WhatsApp us directly for real-time quote status.</p>
                <a href="tel:+977-9818100515" className="text-primary-600 dark:text-brand-cyan font-bold text-sm">+977-9818100515</a>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
