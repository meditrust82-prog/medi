import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const MatchBar = ({ value }) => (
  <div className="flex items-center gap-2 mt-1">
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-xs font-semibold text-primary-600 w-8 text-right">{value}%</span>
  </div>
);

export default function AIRecommendations({ product }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!product?.slug) return;
    setRecs([]);
    setFetched(false);
  }, [product?.slug]);

  useEffect(() => {
    if (!product?.slug || fetched) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          fetchRecs();
        }
      },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [product?.slug, fetched]);

  const CACHE_TTL = 60 * 60 * 1000; // 1 hour
  const cacheKey = `mt_recs_${product?.slug}`;

  const fetchRecs = async () => {
    // Check cache first
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && Date.now() - cached.ts < CACHE_TTL && cached.data?.length) {
        setRecs(cached.data);
        setFetched(true);
        return;
      }
    } catch {}

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          category: product.category,
          userContext: `User is viewing ${product.name} (${product.category || 'medical equipment'}). Price: ${product.price ? `NPR ${product.price}` : 'POA'}. Brand: ${product.brand || 'N/A'}.`,
        }),
      });
      const data = await res.json();
      const recs = data.recommendations || [];
      setRecs(recs);
      try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: recs })); } catch {}
    } catch {
      setRecs([]);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  if (!product) return null;

  return (
    <div ref={ref} className="mt-10 pt-8 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🤖</span>
        <h2 className="text-lg font-bold text-gray-900">AI Recommended For You</h2>
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium ml-1">Powered by AI</span>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40" />
          ))}
        </div>
      )}

      {!loading && recs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recs.map((rec, i) => (
            <Link
              key={i}
              to={`/products/${rec.slug}`}
              className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all flex flex-col"
            >
              {rec.image && (
                <div className="w-full h-28 rounded-lg overflow-hidden bg-gray-50 mb-3 flex-shrink-0">
                  <img
                    src={rec.image}
                    alt={rec.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs text-primary-600 font-medium mb-0.5">{rec.category}</p>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                  {rec.name}
                </h3>
                <MatchBar value={rec.match} />
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{rec.reason}</p>
              </div>
              {rec.price && (
                <p className="text-sm font-bold text-primary-700 mt-3">
                  NPR {rec.price.toLocaleString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {!loading && fetched && recs.length === 0 && (
        <p className="text-sm text-gray-400">No recommendations available right now.</p>
      )}
    </div>
  );
}
