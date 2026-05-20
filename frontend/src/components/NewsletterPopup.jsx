import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api';

const STORAGE_KEY = 'nl_popup_dismissed';
const DISMISS_DAYS = 14;

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY);
    if (last && Date.now() - Number(last) < DISMISS_DAYS * 86400000) return;

    const onMouseLeave = (e) => {
      if (e.clientY <= 0 && !triggered.current) {
        triggered.current = true;
        setVisible(true);
      }
    };

    const timer = setTimeout(() => {
      if (!triggered.current) {
        triggered.current = true;
        setVisible(true);
      }
    }, 35000);

    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    try {
      await api.post('/notify/newsletter', { name: 'Subscriber', phone });
    } catch (_) {}
    setDone(true);
    toast.success("You're subscribed! We'll reach you on Telegram.");
    setTimeout(dismiss, 3000);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={dismiss}>
      <div
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeInUp_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative" style={{ background: 'linear-gradient(135deg, #005EEA 0%, #7CC62D 100%)' }}>
          <div className="px-8 pt-8 pb-10 text-white text-center">
            <div className="text-4xl mb-3">🏥</div>
            <h2 className="text-2xl font-bold mb-2">Stay Updated on Medical Equipment</h2>
            <p className="text-white/85 text-sm">Get notified about new arrivals, exclusive offers, and healthcare equipment tips for Nepal's hospitals and clinics.</p>
          </div>
          <button onClick={dismiss} className="absolute top-4 right-4 text-white/70 hover:text-white transition p-1">
            <FaTimes />
          </button>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl">✈️</span>
          </div>
        </div>

        <div className="px-8 pt-10 pb-8">
          {done ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-semibold text-gray-800 dark:text-white">Thank you! Check your Telegram.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Your phone or Telegram number"
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#229ED9] text-white rounded-xl font-bold hover:bg-[#1a8ab8] transition text-sm flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.58 13.48l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.568 1.079z"/></svg>
                Subscribe via Telegram →
              </button>
              <button type="button" onClick={dismiss} className="w-full text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">
                No thanks, I'll browse without updates
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
