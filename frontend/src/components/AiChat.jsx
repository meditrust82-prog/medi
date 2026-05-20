import React, { useState, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const renderText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>
      : part
  );
};

const Message = ({ content }) => <span>{renderText(content)}</span>;

const buildSystemPrompt = (products) => {
  const productContext = products.length > 0
    ? `\n\nComplete product catalog (${products.length} products):\n${products.map(p =>
        `• ${p.name}\n  Category: ${p.category || 'N/A'} | Price: ${p.price ? `NPR ${p.price.toLocaleString()}` : 'Contact for price'} | Stock: ${p.stock ?? p.quantity ?? 'N/A'}\n  Description: ${p.description || 'N/A'}\n  Specs: ${p.specifications || 'N/A'}\n  Badges: ${p.badges?.join(', ') || 'N/A'}\n  URL: https://meditrustnepal.com/products/${p.slug || p._id}`
      ).join('\n\n')}`
    : '';

  return `You are a knowledgeable medical equipment sales assistant for Meditrust Nepal, based in Kathmandu, Nepal.
You have full knowledge of the Meditrust catalog below AND broad general knowledge of medical equipment specifications, standards, and clinical use from your training data.

Your capabilities:
1. SPECIFICATIONS & FEATURES — For any medical device (whether or not it is in our catalog), use your general medical/technical knowledge to answer questions about specifications, technical parameters, clinical features, certifications (CE, ISO, FDA), operating principles, and how the device works. Be detailed and accurate.
2. PROS & CONS — List clear pros and cons for any product or category based on specs, clinical use case, and industry knowledge.
3. COMPARISON — Compare products or brands side-by-side covering: key specs, pros/cons, best use case, and recommendation.
4. USAGE & PROCEDURE — Explain how to use a device, clinical indications, step-by-step operation, maintenance tips, and safety considerations.
5. BRAND KNOWLEDGE — You know Mindray, Olympus, Stryker, Medtronic, Microlife, GE Healthcare, Philips, Siemens, Dr. Morepen, Jumper, Contec, and many other brands from your training data.

STRICT PRICING RULES — THIS IS CRITICAL:
- ONLY quote prices that are explicitly listed in the Meditrust Nepal catalog below.
- If a product is in the catalog with a price, quote that exact price in NPR.
- If a product is NOT in the catalog, or the catalog shows no price, say: "For pricing, please contact Meditrust Nepal directly at +977-9818100515 or visit meditrustnepal.com."
- NEVER guess, estimate, or reference prices from other sources, competitors, or general market knowledge. Price information must come ONLY from our catalog.

Guidelines:
- Always answer directly and clearly.
- Use bullet points or numbered lists for comparisons, specs, and procedures.
- Only mention full contact details (https://meditrustnepal.com | +977-9818100515 | meditrust82@gmail.com) when the user asks how to order or contact.
- Do not answer questions unrelated to medical equipment or healthcare.${productContext}`;
};

const STORAGE_KEY = 'meditrust_chat';
const DEFAULT_MSG = { role: 'assistant', content: "Hi! I'm Meditrust's AI assistant. How can I help you with medical equipment today?" };

const loadSession = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

export default function AiChat({ currentProduct = null }) {
  const saved = loadSession();
  const [open, setOpen] = useState(saved?.open ?? false);
  const [messages, setMessages] = useState(saved?.messages ?? [DEFAULT_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [humanMode, setHumanMode] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ open, messages }));
    } catch {}
  }, [open, messages]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const loadTawk = () => new Promise((resolve) => {
    if (window.Tawk_API?.maximize) { resolve(); return; }
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.onLoad = () => resolve();
    if (!document.querySelector('script[src*="tawk.to"]')) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://embed.tawk.to/69f737418b97f11c391808aa/1jnmqvmjs';
      s.charset = 'UTF-8';
      s.setAttribute('crossorigin', '*');
      document.head.appendChild(s);
    }
  });

  const switchToHuman = () => {
    setHumanMode(true);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '👋 Connecting you to a human agent via live chat...'
    }]);
    loadTawk().then(() => {
      window.Tawk_API.maximize();
      setOpen(false);
    });
  };

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let all = [], page = 1, pages = 1;
        while (page <= pages) {
          const r = await fetch(`${API_URL}/products?limit=100&page=${page}`);
          const d = await r.json();
          all = [...all, ...(d.products || [])];
          pages = d.pages || 1;
          page++;
          if (page > 10) break; // safety cap
        }
        setAllProducts(all);
      } catch {}
    };
    fetchAll();
  }, []);

  const suggestedQuestions = currentProduct ? [
    `What are the specifications of ${currentProduct.name}?`,
    `Compare ${currentProduct.name} with similar products`,
    `How do I use ${currentProduct.name}?`,
    `Is ${currentProduct.name} CE and ISO certified?`,
  ] : [
    'What ICU ventilators do you have?',
    'Compare patient monitors',
    'What surgical instruments are available?',
    'How to choose a diagnostic device?',
  ];

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const systemPrompt = buildSystemPrompt(allProducts);
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-6),
            userMsg,
          ],
          temperature: 0.6,
          max_tokens: 800,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Close when WhatsApp opens; close WhatsApp when we open
  useEffect(() => {
    const onWaOpen = () => setOpen(false);
    window.addEventListener('wa:open', onWaOpen);
    return () => window.removeEventListener('wa:open', onWaOpen);
  }, []);

  const handleToggle = (o) => {
    const next = !o;
    if (next) window.dispatchEvent(new CustomEvent('ai:open'));
    setOpen(next);
  };

  const chatPanel = (isMobile) => (
    <div style={{
      ...(isMobile
        ? { position: 'fixed', inset: 0, zIndex: 2000, borderRadius: 0, paddingBottom: '64px' }
        : { width: '320px', height: '460px', borderRadius: '16px', marginBottom: '10px', border: '1px solid #e5e7eb' }),
      background: 'white',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', padding: '12px 16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>🤖 Meditrust Assistant</div>
          <div style={{ fontSize: '11px', opacity: 0.85 }}>{humanMode ? 'Transferring to human agent...' : 'AI-powered · Ask anything'}</div>
        </div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && !loading && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {suggestedQuestions.map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', fontSize: '11px', padding: '4px 8px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', lineHeight: '1.4' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '82%', padding: '8px 12px',
              borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              background: m.role === 'user' ? '#0ea5e9' : '#f3f4f6',
              color: m.role === 'user' ? 'white' : '#111', fontSize: '13px', lineHeight: '1.5',
              wordBreak: 'break-word', overflowWrap: 'anywhere'
            }}>
              {m.role === 'assistant' ? <Message content={m.content} /> : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: '14px 14px 14px 2px', fontSize: '13px', color: '#888' }}>● ● ●</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!humanMode && (
        <div style={{ padding: '6px 12px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
          <button
            onClick={switchToHuman}
            style={{ background: 'none', border: 'none', color: '#0ea5e9', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            💬 Talk to a human agent
          </button>
        </div>
      )}

      <div style={{ padding: '10px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask a question..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none' }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '50%',
            width: '34px', height: '34px', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: loading || !input.trim() ? 0.5 : 1, flexShrink: 0
          }}
        >➤</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: full-screen overlay */}
      {open && <div className="lg:hidden">{chatPanel(true)}</div>}

      {/* Desktop: corner popup — sits directly above WhatsApp widget */}
      <div className="ai-chat-desktop hidden lg:block fixed bottom-[88px] right-6 z-[1000]" style={{ transition: 'bottom 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        {open && chatPanel(false)}
        <button
          onClick={() => handleToggle(open)}
          className="flex items-center justify-center"
          style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
          }}
          title="Chat with Assistant"
        >
          {open ? '×' : '💬'}
        </button>
      </div>

      {/* Mobile: floating trigger button above tab bar */}
      <button
        className="lg:hidden fixed bottom-20 right-4 z-[1000] flex items-center justify-center"
        onClick={() => handleToggle(open)}
        style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
        }}
        title="Chat with Assistant"
      >
        {open ? '×' : '💬'}
      </button>
    </>
  );
}
