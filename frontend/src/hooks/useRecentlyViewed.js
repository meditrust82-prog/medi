import { useState, useEffect, useCallback } from 'react';

const KEY = 'mt_recently_viewed';
const MAX = 6;

export function useRecentlyViewed() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  const add = useCallback((product) => {
    if (!product?.slug) return;
    setItems(prev => {
      const filtered = prev.filter(p => p.slug !== product.slug);
      const next = [
        { slug: product.slug, name: product.name, category: product.category, price: product.price, image: product.image || product.images?.[0]?.url || product.images?.[0]?.path || null },
        ...filtered,
      ].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { items, add };
}
