import React, { useState, useEffect } from 'react';

/**
 * Shows a live countdown timer until `endsAt`.
 * Returns null if endsAt is missing or already passed.
 */
export default function FlashCountdown({ endsAt, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endsAt) return;
    const end = new Date(endsAt).getTime();

    const calc = () => {
      const diff = end - Date.now();
      if (diff <= 0) { setTimeLeft(null); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!timeLeft) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const parts = timeLeft.d > 0
    ? [`${timeLeft.d}d`, `${pad(timeLeft.h)}h`, `${pad(timeLeft.m)}m`, `${pad(timeLeft.s)}s`]
    : [`${pad(timeLeft.h)}h`, `${pad(timeLeft.m)}m`, `${pad(timeLeft.s)}s`];

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-bold text-sm ${className}`}>
      ⏱ Ends in {parts.join(' ')}
    </span>
  );
}
