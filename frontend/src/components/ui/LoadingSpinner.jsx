import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-2',
  };

  return (
    <div
      className={`${sizes[size]} border-[var(--border)] border-t-brand-cyan rounded-full animate-spin ${className}`}
    />
  );
};

/* Animated ECG / heartbeat bar used as a page-level loading indicator */
export const HeartbeatBar = () => (
  <div className="w-full flex justify-center items-center" style={{ height: '3px', overflow: 'visible' }}>
    <svg
      className="heartbeat-bar"
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      style={{ height: '12px', width: '100%', maxWidth: '480px' }}
      aria-hidden="true"
    >
      {/* ECG-style path: flat → flat → spike up → spike down → flat → flat */}
      <path
        className="heartbeat-path"
        d="M0,6 L60,6 L80,6 L90,1 L100,11 L110,1 L120,6 L140,6 L300,6"
      />
    </svg>
  </div>
);

export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
    <div className="w-64">
      <HeartbeatBar />
    </div>
    <p className="text-[var(--text-muted)] text-sm font-medium tracking-wide">{message}</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="theme-card overflow-hidden">
    <div className="h-48 skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-4 skeleton rounded-[10px] w-3/4" />
      <div className="h-3 skeleton rounded-[10px] w-1/2" />
      <div className="h-8 skeleton rounded-[10px] w-1/3 mt-4" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div>
    <div className="grid gap-4 p-6" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 skeleton rounded" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="grid gap-4 px-6 py-4 border-t border-[var(--border)]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="h-3 skeleton rounded" />
        ))}
      </div>
    ))}
  </div>
);

export default LoadingSpinner;
