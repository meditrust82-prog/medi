import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FlashCountdown from './FlashCountdown';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const CACHE_TTL = 5 * 60 * 1000; // 5 min
const cache = {};

async function trackClick(id) {
  try { await fetch(`${API_URL}/banners/${id}/click`, { method: 'POST' }); } catch {}
}

async function fetchBanners(placement) {
  const key = placement || 'all';
  if (cache[key] && Date.now() - cache[key].ts < CACHE_TTL) return cache[key].data;
  try {
    const r = await fetch(`${API_URL}/banners${placement ? `?placement=${placement}` : ''}`);
    const d = await r.json();
    cache[key] = { ts: Date.now(), data: d.banners || [] };
    return cache[key].data;
  } catch { return []; }
}

// ── Announcement bar (top of site) ─────────────────────────────
export function AnnouncementBar() {
  const [banners, setBanners] = useState([]);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => { fetchBanners('announcement').then(setBanners); }, []);
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length || dismissed) return null;
  const b = banners[idx];

  return (
    <div
      className="w-full py-2 px-4 flex items-center justify-center gap-3 text-sm font-medium relative"
      style={{ background: b.bgColor || '#005EEA', color: b.textColor || '#fff' }}
    >
      <span className="text-center flex-1 flex items-center justify-center gap-3 flex-wrap">
        <span>{b.title}</span>
        {b.endsAt && <FlashCountdown endsAt={b.endsAt} className="opacity-90" />}
        {b.linkUrl && (
          <a
            href={b.linkUrl}
            target={b.linkUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="underline font-bold opacity-90 hover:opacity-100"
          >
            {b.linkLabel || 'Learn more →'}
          </a>
        )}
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 text-lg leading-none"
        aria-label="Dismiss"
      >×</button>
    </div>
  );
}

// ── Full-width card banner (home hero / home mid) ──────────────
export function CardBanner({ placement }) {
  const [banners, setBanners] = useState([]);
  useEffect(() => { fetchBanners(placement).then(setBanners); }, [placement]);
  if (!banners.length) return null;

  return (
    <div className="space-y-4">
      {banners.map(b => {
        const inner = (
          <div
            className="rounded-2xl overflow-hidden relative flex items-center gap-6 p-6 sm:p-8 min-h-[120px] sm:min-h-[140px]"
            style={{ background: b.imageUrl ? undefined : (b.bgColor || '#005EEA'), color: b.textColor || '#fff' }}
          >
            {b.imageUrl && (
              <img
                src={b.imageUrl}
                alt={b.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className={`relative z-10 flex-1 ${b.imageUrl ? 'bg-black/40 rounded-xl p-4' : ''}`}>
              <p className="font-bold text-lg sm:text-xl leading-snug" style={{ color: b.textColor || '#fff' }}>{b.title}</p>
              {b.subtitle && <p className="text-sm mt-1 opacity-85" style={{ color: b.textColor || '#fff' }}>{b.subtitle}</p>}
              {b.linkUrl && (
                <span className="inline-block mt-3 px-4 py-1.5 bg-white text-primary-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition">
                  {b.linkLabel || 'View offer'}
                </span>
              )}
            </div>
          </div>
        );

        return b.linkUrl ? (
          <a
            key={b._id}
            href={b.linkUrl}
            onClick={() => trackClick(b._id)}
            target={b.linkUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="block hover:opacity-95 transition-opacity"
          >
            {inner}
          </a>
        ) : (
          <div key={b._id}>{inner}</div>
        );
      })}
    </div>
  );
}

// ── Compact sidebar banner ──────────────────────────────────────
export function SidebarBanner({ placement = 'products_sidebar' }) {
  const [banners, setBanners] = useState([]);
  useEffect(() => { fetchBanners(placement).then(setBanners); }, [placement]);
  if (!banners.length) return null;

  return (
    <div className="space-y-3 mt-4">
      {banners.map(b => {
        const inner = (
          <div
            className="rounded-xl overflow-hidden relative p-4 text-sm"
            style={{ background: b.imageUrl ? undefined : (b.bgColor || '#005EEA'), color: b.textColor || '#fff', minHeight: 80 }}
          >
            {b.imageUrl && (
              <img src={b.imageUrl} alt={b.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className={`relative z-10 ${b.imageUrl ? 'bg-black/50 rounded-lg p-3' : ''}`}>
              <p className="font-bold leading-snug" style={{ color: b.textColor || '#fff' }}>{b.title}</p>
              {b.subtitle && <p className="text-xs mt-1 opacity-80" style={{ color: b.textColor || '#fff' }}>{b.subtitle}</p>}
              {b.linkUrl && (
                <span className="inline-block mt-2 px-3 py-1 bg-white text-primary-700 text-xs font-semibold rounded-lg">
                  {b.linkLabel || 'View'}
                </span>
              )}
            </div>
          </div>
        );
        return b.linkUrl ? (
          <a key={b._id} href={b.linkUrl} onClick={() => trackClick(b._id)} target={b.linkUrl.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="block hover:opacity-95 transition-opacity">
            {inner}
          </a>
        ) : <div key={b._id}>{inner}</div>;
      })}
    </div>
  );
}

// ── Inline strip between product grid rows ─────────────────────
export function InlineBanner({ placement = 'products_inline' }) {
  const [banner, setBanner] = useState(null);
  useEffect(() => { fetchBanners(placement).then(b => setBanner(b[0] || null)); }, [placement]);
  if (!banner) return null;

  const inner = (
    <div
      className="rounded-xl overflow-hidden relative flex items-center gap-4 px-5 py-4 col-span-full"
      style={{ background: banner.imageUrl ? undefined : (banner.bgColor || '#7CC62D'), color: banner.textColor || '#fff', minHeight: 72 }}
    >
      {banner.imageUrl && <img src={banner.imageUrl} alt={banner.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
      <div className="relative z-10 flex-1 flex items-center gap-4">
        <div className="flex-1">
          <p className="font-bold text-sm sm:text-base" style={{ color: banner.textColor || '#fff' }}>{banner.title}</p>
          {banner.subtitle && <p className="text-xs opacity-80 mt-0.5" style={{ color: banner.textColor || '#fff' }}>{banner.subtitle}</p>}
        </div>
        {banner.linkUrl && (
          <span className="flex-shrink-0 px-4 py-2 bg-white text-primary-700 text-xs font-bold rounded-lg">
            {banner.linkLabel || 'View'}
          </span>
        )}
      </div>
    </div>
  );

  return banner.linkUrl ? (
    <a href={banner.linkUrl} onClick={() => trackClick(banner._id)} target={banner.linkUrl.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="block col-span-full hover:opacity-95 transition-opacity">
      {inner}
    </a>
  ) : inner;
}

export default PromoBanner;

function PromoBanner() { return null; }
