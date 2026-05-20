import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Logo = ({ size = 'md', className = '', linkTo = '/' }) => {
  const [imgError, setImgError] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setAnimKey(k => k + 1);
  }, [location.pathname]);

  const sizes = {
    sm: { img: 'h-8 w-auto max-w-[120px]', text1: 'text-lg', text2: 'text-xs' },
    md: { img: 'h-20 w-auto max-w-[260px]', text1: 'text-2xl', text2: 'text-sm' },
    lg: { img: 'h-20 w-auto max-w-[260px]', text1: 'text-4xl', text2: 'text-lg' },
    xl: { img: 'h-24 w-auto max-w-[300px]', text1: 'text-5xl', text2: 'text-xl' },
  };

  const s = sizes[size] || sizes.md;

  const content = (
    <span key={animKey} className={`flex items-center gap-2 logo-animate ${className}`}>
      {!imgError ? (
        <img
          src="/logo.jpeg"
          alt="Meditrust Nepal"
          className={`${s.img} w-auto object-contain select-none logo-img`}
          onError={() => setImgError(true)}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      ) : (
        <span className="flex items-center gap-1.5">
          <span className={`font-extrabold ${s.text1} leading-none`}>
            <span className="text-cyan-400">MEDI</span>
            <span className="text-green-400">TRUST</span>
          </span>
          <span className={`${s.text2} text-gray-400 font-medium leading-tight hidden sm:block`}>
            Nepal
          </span>
        </span>
      )}
    </span>
  );

  if (!linkTo) return content;

  return (
    <Link to={linkTo} className="flex items-center group">
      {content}
    </Link>
  );
};

export default Logo;
