import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useWhatsApp } from '../contexts/WhatsAppContext';

const PHONE = '9779818100515';

const PAGE_MESSAGES = {
  '/products': 'Hello Meditrust Nepal! I am looking for medical equipment. Can you help?',
  '/bulk-inquiry': 'Hello! I need a bulk equipment quote for my hospital.',
  '/services': 'Hello! I would like to know more about your services and maintenance contracts.',
  '/about': 'Hello Meditrust Nepal! I would like to know more about your company.',
  '/contact': 'Hello! I have an inquiry for Meditrust Nepal.',
  '/blog': 'Hello! I read your blog and have a question about medical equipment.',
  '/kathmandu-medical-equipment-supplier': 'Hello! I am looking for a medical equipment supplier in Kathmandu.',
};

const DEFAULT_MSG = 'Hello Meditrust Nepal! I need help with medical equipment.';

export default function FloatingWhatsApp() {
  const location = useLocation();
  const { productName } = useWhatsApp?.() || {};
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shake, setShake] = useState(false);

  // Hide on admin and cart pages
  const hidden = location.pathname.startsWith('/admin') || location.pathname === '/cart';

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Shake attention after 10s
  useEffect(() => {
    if (!visible || hidden) return;
    const t = setTimeout(() => {
      setShake(true);
      setTimeout(() => setShake(false), 1000);
    }, 10000);
    return () => clearTimeout(t);
  }, [visible, hidden]);

  // Build context-aware message
  const getMessage = () => {
    if (productName) return `Hello! I am interested in *${productName}*. Please provide a quotation.`;
    const path = location.pathname;
    for (const [key, msg] of Object.entries(PAGE_MESSAGES)) {
      if (path.startsWith(key)) return msg;
    }
    return DEFAULT_MSG;
  };

  if (hidden || !visible) return null;

  const waUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(getMessage())}`;

  return (
    <div className="fixed bottom-24 right-4 z-[150] flex flex-col items-end gap-2 lg:bottom-8">
      {/* Tooltip bubble */}
      {open && (
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border p-4 w-64 animate-[fadeInUp_0.2s_ease-out]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FaWhatsapp className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Meditrust Nepal</p>
                <p className="text-[10px] text-green-500 font-medium">● Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
              <FaTimes className="text-xs" />
            </button>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 mb-3">
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              👋 Hi! Need a quote or have questions about medical equipment? Chat with us now.
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold transition"
            onClick={() => setOpen(false)}
          >
            <FaWhatsapp /> Start Chat
          </a>
          <p className="text-[10px] text-gray-400 text-center mt-2">Typically replies within minutes</p>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat on WhatsApp"
        className={`w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all ${shake ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}`}
        style={{ boxShadow: '0 4px 20px rgba(34,197,94,0.5)' }}
      >
        {open ? <FaTimes className="text-xl" /> : <FaWhatsapp className="text-2xl" />}
      </button>
    </div>
  );
}
