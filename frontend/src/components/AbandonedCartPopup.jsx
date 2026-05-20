import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';

export default function AbandonedCartPopup() {
  const { cart } = useCart();
  const [visible, setVisible] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (cart.length === 0 || shown.current) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !shown.current) {
        shown.current = true;
        setVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [cart]);

  if (!visible || cart.length === 0) return null;

  const waMsg = encodeURIComponent(
    `Hello Meditrust Nepal! I had ${cart.length} item(s) in my cart:\n\n` +
    cart.map((p, i) => `${i + 1}. ${p.name} (Qty: ${p.qty || 1})`).join('\n') +
    '\n\nCan you help me complete my order?'
  );

  return (
    <div className="fixed inset-0 z-[180] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[fadeInUp_0.3s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <FaShoppingCart className="text-amber-600 text-lg" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Wait — don't leave yet!</h3>
          </div>
          <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <FaTimes />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">
          You have <strong>{cart.length} item{cart.length !== 1 ? 's' : ''}</strong> in your cart. Get a quote before you go — it's free and instant.
        </p>

        <div className="bg-gray-50 dark:bg-dark-card rounded-xl p-3 mb-5 space-y-1 max-h-28 overflow-y-auto">
          {cart.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
              <span className="line-clamp-1">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={`https://wa.me/9779818100515?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setVisible(false)}
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition text-sm"
          >
            💬 Get Quote via WhatsApp
          </a>
          <Link
            to="/cart"
            onClick={() => setVisible(false)}
            className="flex items-center justify-center w-full border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-dark-card transition"
          >
            View Cart
          </Link>
          <button onClick={() => setVisible(false)} className="text-xs text-gray-400 hover:text-gray-600 transition">
            No thanks, I'll browse more
          </button>
        </div>
      </div>
    </div>
  );
}
