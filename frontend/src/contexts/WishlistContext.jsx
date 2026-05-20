import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const KEY = 'mt_wishlist';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  const toggle = useCallback((product) => {
    if (!product?.slug) return;
    setWishlist(prev => {
      const exists = prev.some(p => p.slug === product.slug);
      const next = exists
        ? prev.filter(p => p.slug !== product.slug)
        : [...prev, { slug: product.slug, name: product.name, category: product.category, price: product.price, image: product.image || product.images?.[0]?.url || product.images?.[0]?.path || null }];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      toast(exists ? '💔 Removed from wishlist' : '❤️ Added to wishlist', { autoClose: 1500, position: 'bottom-right' });
      return next;
    });
  }, []);

  const isWishlisted = useCallback((slug) => wishlist.some(p => p.slug === slug), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
