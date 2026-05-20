import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const SUGGESTIONS = [
  'ICU ventilator for small hospital',
  'Portable ECG machine under budget',
  'Surgical instruments for laparoscopy',
  'Patient monitor with SpO2 and ECG',
];

function FinderContent({ query, setQuery, results, loading, error, onSearch }) {
  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
          placeholder="e.g. ventilator for ICU..."
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-gray-400"
          autoFocus
        />
        <button
          onClick={() => onSearch()}
          disabled={loading || !query.trim()}
          className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading ? '...' : 'Find'}
        </button>
      </div>

      {!results && !loading && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setQuery(s); onSearch(s); }}
              className="text-xs bg-white border border-primary-200 text-primary-700 px-2.5 py-1 rounded-full hover:bg-primary-50 transition">
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {loading && (
        <div className="mt-4 space-y-2">
          {[1,2,3].map(i => <div key={i} className="animate-pulse bg-white rounded-lg h-14 border border-primary-100" />)}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500 font-medium">Best matches:</p>
          {results.map((r, i) => (
            <Link key={i} to={`/products/${r.slug}`}
              className="flex items-start gap-3 bg-white rounded-xl p-3 border border-primary-100 hover:border-primary-300 hover:shadow-sm transition group">
              {r.image && <img src={r.image} alt={r.name} loading="lazy" className="w-12 h-12 rounded-lg object-contain flex-shrink-0 bg-gray-50" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary-600 font-medium">{r.category}</p>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition truncate">{r.name}</p>
                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{r.reason}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                {r.price && <p className="text-xs font-bold text-primary-700">NPR {r.price.toLocaleString()}</p>}
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{r.match}% match</span>
              </div>
            </Link>
          ))}
          <button onClick={() => { setResults(null); setQuery(''); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline mt-1 block">Search again</button>
        </div>
      )}

      {results && results.length === 0 && (
        <p className="text-xs text-gray-500 mt-3 text-center">No matches found. Try a different description.</p>
      )}
    </>
  );
}

export default function AIProductFinder() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const search = async (q) => {
    const text = (q || query).trim();
    if (!text) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch(`${API_URL}/ai/finder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
    } catch (e) {
      setError('Could not get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const props = { query, setQuery, results, loading, error, onSearch: search };

  return (
    <>
      {/* ── Desktop sidebar card ────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-2xl p-5 mb-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🤖</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">AI Product Finder</h3>
            <p className="text-xs text-gray-500">Describe what you need</p>
          </div>
        </div>
        <FinderContent {...props} />
      </div>

      {/* ── Mobile: floating button (visible only on < lg) ────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-[88px] right-4 z-40 flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold hover:bg-primary-700 transition"
      >
        🤖 AI Finder
      </button>

      {/* ── Mobile: bottom sheet ─────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">AI Product Finder</h3>
                  <p className="text-xs text-gray-500">Describe what you need</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">×</button>
            </div>
            <div className="overflow-y-auto p-5 flex-1">
              <FinderContent {...props} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
