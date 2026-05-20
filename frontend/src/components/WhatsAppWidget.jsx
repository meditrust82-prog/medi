import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const [productContext, setProductContext] = useState('');

  // Auto-fill context based on route
  useEffect(() => {
    if (location.pathname.includes('/products/')) {
      setProductContext('I am interested in a product I saw on your website.');
    } else if (location.pathname.includes('/projects')) {
      setProductContext('I would like to discuss a hospital setup project.');
    } else {
      setProductContext('Hello! I have an inquiry about Meditrust Nepal products.');
    }
  }, [location]);

  // Show a little notification dot after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !hasScrolled) {
        setHasScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  useEffect(() => {
    const onAiOpen = () => {
      setIsOpen(false);
      document.body.setAttribute('data-wa-open', 'false');
    };
    window.addEventListener('ai:open', onAiOpen);
    return () => window.removeEventListener('ai:open', onAiOpen);
  }, []);

  const toggleWidget = () => {
    const next = !isOpen;
    setIsOpen(next);
    document.body.setAttribute('data-wa-open', next ? 'true' : 'false');
    if (next) window.dispatchEvent(new CustomEvent('wa:open'));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    const url = `https://wa.me/9779818100515?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    document.body.setAttribute('data-wa-open', 'false');
  };

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col items-end">
      {/* Widget Window */}
      <div 
        className={`mb-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 text-xl font-bold">
                M
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h4 className="font-bold text-sm">Meditrust Nepal</h4>
              <p className="text-xs text-green-100">Typically replies immediately</p>
            </div>
          </div>
          <button onClick={toggleWidget} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 h-[240px] overflow-y-auto">
          <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100 mb-2 w-5/6">
            Hello! 👋 Welcome to Meditrust Nepal. How can we help you with medical equipment today?
          </div>
        </div>

        <div className="p-3 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <textarea 
              name="message"
              defaultValue={productContext}
              className="flex-1 max-h-24 resize-none rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
              rows="2"
              placeholder="Type your message..."
              required
            ></textarea>
            <button type="submit" className="w-10 h-10 flex-shrink-0 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm">
              <FaWhatsapp className="text-xl -ml-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button 
        onClick={toggleWidget}
        className={`relative w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:shadow-cyan-green hover:bg-green-600 transition-all transform hover:scale-105 z-50`}
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaWhatsapp />}
        {!isOpen && hasScrolled && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default WhatsAppWidget;
