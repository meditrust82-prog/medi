import React from 'react';

const PixelDesert = ({ message = 'PAGE NOT FOUND' }) => (
  <>
    <style>{`
      /* ---------- pixel font ---------- */
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      .pixel-font { font-family: 'Press Start 2P', monospace; }

      /* clouds drift left */
      @keyframes drift1 {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-340px); }
      }
      @keyframes drift2 {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-480px); }
      }
      .cloud1 { animation: drift1 14s linear infinite; }
      .cloud2 { animation: drift2 20s linear infinite; }

      /* robot body bob */
      @keyframes bob {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-6px); }
      }
      .robot-body { animation: bob 1.2s ease-in-out infinite; }

      /* robot "eye" blink */
      @keyframes blink {
        0%,90%,100% { transform: scaleY(1); }
        95%          { transform: scaleY(0.1); }
      }
      .robot-eye { animation: blink 3s ease-in-out infinite; }

      /* antenna pulse */
      @keyframes pulse-dot {
        0%,100% { opacity: 1; }
        50%      { opacity: 0; }
      }
      .antenna-dot { animation: pulse-dot 0.8s ease-in-out infinite; }

      /* wheels spin */
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      .wheel { animation: spin 0.6s linear infinite; }

      /* cactus sway */
      @keyframes sway {
        0%,100% { transform: rotate(0deg); transform-origin: bottom center; }
        50%      { transform: rotate(3deg); transform-origin: bottom center; }
      }
      .cactus { animation: sway 2s ease-in-out infinite; }

      /* ground particles */
      @keyframes dust {
        0%   { opacity: 0.8; transform: translateX(0) translateY(0); }
        100% { opacity: 0; transform: translateX(-18px) translateY(4px); }
      }
      .dust1 { animation: dust 0.8s ease-out infinite; }
      .dust2 { animation: dust 0.8s ease-out 0.4s infinite; }
    `}</style>

    <div className="pixel-font select-none" style={{ imageRendering: 'pixelated', width: 340, maxWidth: '100%' }}>

      {/* SKY */}
      <div className="relative bg-white overflow-hidden" style={{ height: 220, width: '100%' }}>

        {/* cloud 1 — top right */}
        <svg className="cloud1 absolute" style={{ top: 10, right: -10 }} width="90" height="36" viewBox="0 0 90 36">
          <rect x="20" y="18" width="50" height="18" fill="none" stroke="#111" strokeWidth="3" />
          <rect x="30" y="6"  width="30" height="18" fill="none" stroke="#111" strokeWidth="3" />
          <rect x="38" y="0"  width="14" height="10" fill="none" stroke="#111" strokeWidth="3" />
        </svg>

        {/* cloud 2 — left */}
        <svg className="cloud2 absolute" style={{ top: 48, left: 10 }} width="80" height="32" viewBox="0 0 80 32">
          <rect x="18" y="16" width="44" height="16" fill="none" stroke="#111" strokeWidth="3" />
          <rect x="26" y="6"  width="28" height="16" fill="none" stroke="#111" strokeWidth="3" />
          <rect x="32" y="0"  width="16" height="10" fill="none" stroke="#111" strokeWidth="3" />
        </svg>

        {/* ground line */}
        <div className="absolute bottom-0 w-full" style={{ borderTop: '3px solid #111' }} />
        {/* bumps */}
        {[20,80,140,200,260,310].map(x => (
          <div key={x} className="absolute" style={{ bottom: 0, left: x, width: 14, height: 7, borderRadius: '50% 50% 0 0', border: '2px solid #111', borderBottom: 'none', background: 'white' }} />
        ))}

        {/* CACTUS */}
        <svg className="cactus absolute" style={{ bottom: 0, right: 54 }} width="32" height="80" viewBox="0 0 32 80">
          {/* trunk */}
          <rect x="12" y="16" width="8" height="64" fill="#2ecc71" stroke="#111" strokeWidth="2" />
          {/* arm left */}
          <rect x="2"  y="36" width="10" height="6"  fill="#2ecc71" stroke="#111" strokeWidth="2" />
          <rect x="2"  y="22" width="6"  height="20" fill="#2ecc71" stroke="#111" strokeWidth="2" />
          {/* arm right */}
          <rect x="20" y="44" width="10" height="6"  fill="#2ecc71" stroke="#111" strokeWidth="2" />
          <rect x="24" y="30" width="6"  height="26" fill="#2ecc71" stroke="#111" strokeWidth="2" />
        </svg>

        {/* ROBOT — centered */}
        <g style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>
          <svg className="robot-body" width="100" height="110" viewBox="0 0 100 110">
            {/* antenna base */}
            <rect x="46" y="4"  width="8"  height="18" fill="#111" />
            {/* antenna dot */}
            <rect className="antenna-dot" x="43" y="0" width="14" height="8" fill="#2ecc71" stroke="#111" strokeWidth="2" rx="1" />

            {/* head */}
            <rect x="18" y="22" width="64" height="44" fill="#2ecc71" stroke="#111" strokeWidth="3" rx="2" />

            {/* eye screen */}
            <rect x="24" y="30" width="32" height="24" fill="#111" rx="2" />
            {/* eye glow */}
            <rect className="robot-eye" x="30" y="36" width="20" height="12" fill="#2ecc71" rx="1" />

            {/* side detail */}
            <rect x="82" y="30" width="10" height="10" fill="#111" stroke="#2ecc71" strokeWidth="2" />

            {/* badge / label */}
            <rect x="6"  y="66" width="88" height="26" fill="#111" rx="2" />
            <rect x="8"  y="68" width="16" height="22" fill="#2ecc71" rx="1" />
            <text x="30" y="85" fill="white" fontSize="9" fontFamily="'Press Start 2P',monospace">Meditrust</text>

            {/* body lower */}
            <rect x="22" y="92" width="56" height="14" fill="#2ecc71" stroke="#111" strokeWidth="2" rx="1" />

            {/* wheels */}
            <g transform="translate(26,106)">
              <circle cx="0" cy="0" r="7" fill="#111" />
              <circle className="wheel" cx="0" cy="0" r="4" fill="none" stroke="#2ecc71" strokeWidth="2" strokeDasharray="4 4" />
            </g>
            <g transform="translate(74,106)">
              <circle cx="0" cy="0" r="7" fill="#111" />
              <circle className="wheel" cx="0" cy="0" r="4" fill="none" stroke="#2ecc71" strokeWidth="2" strokeDasharray="4 4" />
            </g>

            {/* dust particles */}
            <rect className="dust1" x="12" y="100" width="4" height="4" fill="#888" />
            <rect className="dust2" x="20" y="102" width="3" height="3" fill="#aaa" />
          </svg>
        </g>
      </div>

      {/* MESSAGE */}
      <p className="pixel-font text-center mt-6 text-black" style={{ fontSize: 'clamp(10px, 3vw, 16px)', letterSpacing: 2 }}>
        {message}
      </p>
    </div>
  </>
);

export default PixelDesert;
