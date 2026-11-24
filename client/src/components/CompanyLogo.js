'use client';

import React from 'react';

export default function CompanyLogo({ company = '', size = 'md', className = '' }) {
  const c = (company || '').toLowerCase().trim();

  // Consistent size specifications
  const sizeMap = {
    sm: { container: 'w-9 h-9 p-1.5 rounded-xl', icon: 'w-5 h-5', text: 'text-xs' },
    md: { container: 'w-12 h-12 p-2 rounded-2xl', icon: 'w-7 h-7', text: 'text-sm' },
    lg: { container: 'w-14 h-14 p-2.5 rounded-2xl', icon: 'w-8 h-8', text: 'text-base' },
    xl: { container: 'w-20 h-20 p-3.5 rounded-2xl', icon: 'w-12 h-12', text: 'text-2xl' },
  };

  const s = sizeMap[size] || sizeMap.md;
  const baseContainer = `bg-white border border-gray-100 shadow-xs flex items-center justify-center shrink-0 ${s.container} ${className}`;

  // 1. Google (Official 4-color G)
  if (c.includes('google')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      </div>
    );
  }

  // 2. Microsoft (Official 4-color square brand tiles)
  if (c.includes('microsoft')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 24 24">
          <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
          <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
          <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
          <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
        </svg>
      </div>
    );
  }

  // 3. Meta (Official Meta infinity ribbon in Meta Blue)
  if (c.includes('meta')) {
    return (
      <div className={baseContainer}>
        <svg className={`${s.icon} text-blue-600`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.92 5C14.88 5 13.06 6.09 12 7.74 10.94 6.09 9.12 5 7.08 5 3.72 5 1 7.77 1 11.18c0 4.19 3.52 7.9 7.82 9.77.72.31 1.54.46 2.37.46.83 0 1.65-.15 2.37-.46C17.86 19.08 21.38 15.37 21.38 11.18 21.38 7.77 18.66 5 15.3 5h1.62zM7.08 17.52c-2.48 0-4.5-2.02-4.5-4.5 0-2.48 2.02-4.5 4.5-4.5 1.54 0 2.92.78 3.75 1.97-.93 1.95-2.22 4.41-3.75 7.03zm9.84 0c-1.53-2.62-2.82-5.08-3.75-7.03.83-1.19 2.21-1.97 3.75-1.97 2.48 0 4.5 2.02 4.5 4.5 0 2.48-2.02 4.5-4.5 4.5z"/>
        </svg>
      </div>
    );
  }

  // 4. Amazon (Full authentic Amazon logo with prominent orange smile arrow)
  if (c.includes('amazon')) {
    return (
      <div className={baseContainer}>
        <svg className="w-full h-full" viewBox="0 0 48 32" fill="none">
          {/* amazon brand name */}
          <text x="2" y="16" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="900" fill="#131921" letterSpacing="-0.5">amazon</text>
          {/* signature orange smile curve */}
          <path d="M4 22C12 27 28 27 38 20" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M35 18.5L40 20.5L37.5 24" fill="#FF9900"/>
        </svg>
      </div>
    );
  }

  // 5. Apple (Official Apple bitten apple silhouette)
  if (c.includes('apple')) {
    return (
      <div className={baseContainer}>
        <svg className={`${s.icon} text-gray-950 fill-current`} viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.77-11.64-14.19-5.78-9.13-10.3-19.46-13.56-30.98-3.26-11.53-4.89-22.6-4.89-33.22 0-14.78 3.81-27.14 11.43-37.07 7.62-9.93 17.3-14.99 29.04-15.19 4.35 0 9.29 1.14 14.82 3.42 5.53 2.28 9.28 3.48 11.25 3.6 1.74 0 5.69-1.28 11.85-3.83 6.16-2.56 11.45-3.74 15.86-3.54 12.94.76 23.38 5.76 31.33 15-11.3 6.85-16.85 16.29-16.63 28.32.22 9.57 3.86 17.65 10.92 24.23 7.07 6.58 15.44 10.27 25.13 11.08-2.61 7.83-5.98 16.09-10.12 24.78zM119.22 33.15c0-7.39 2.66-14.41 7.99-21.05 5.33-6.63 11.96-10.97 19.89-13.01.22 1.09.33 2.07.33 2.93 0 7.39-2.77 14.4-8.32 21.03-5.55 6.63-12.23 10.76-20.04 12.39.11-.76.15-1.52.15-2.29z"/>
        </svg>
      </div>
    );
  }

  // 6. Uber (Official Uber bold badge)
  if (c.includes('uber')) {
    return (
      <div className={baseContainer}>
        <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
          <span className="font-extrabold tracking-tight text-white text-[11px]">UBER</span>
        </div>
      </div>
    );
  }

  // 7. CloudScale Inc. (Azure Blue Cloud Node on white backdrop)
  if (c.includes('cloudscale') || c.includes('cloud')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <path d="M24 22H10a6 6 0 0 1-1.5-11.8A8 8 0 0 1 24 13.5 5 5 0 0 1 24 22z" fill="url(#cloudscale-grad)"/>
          <path d="M16 15v5m-2-2 2 2 2-2" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="cloudscale-grad" x1="4" y1="8" x2="28" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 8. Apex Security (Ruby / Crimson Cybersecurity Crest on white backdrop)
  if (c.includes('apex')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <path d="M16 3L6 7v8c0 7.2 4.3 13.9 10 15 5.7-1.1 10-7.8 10-15V7l-10-4z" fill="url(#apex-grad)" />
          <path d="M12 15l3 3 5-5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="apex-grad" x1="6" y1="3" x2="26" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e11d48" />
              <stop offset="1" stopColor="#be123c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 9. OmniStream Health (Emerald / Cyan HealthTech pulse cross on white backdrop)
  if (c.includes('omnistream') || c.includes('health')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <rect x="3" y="3" width="26" height="26" rx="8" fill="#10b981" fillOpacity="0.12" />
          <path d="M16 7v18M7 16h18" stroke="url(#omni-grad)" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3.2" fill="#059669" />
          <defs>
            <linearGradient id="omni-grad" x1="7" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 10. FinLeap Technologies (Cyan / Royal Blue Fintech Smart Card on white backdrop)
  if (c.includes('finleap')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <rect x="3" y="7" width="26" height="18" rx="4.5" fill="url(#finleap-grad)" />
          <rect x="3" y="11" width="26" height="3" fill="#0f172a" fillOpacity="0.25" />
          <circle cx="10" cy="19" r="2.2" fill="#38bdf8" />
          <circle cx="14.5" cy="19" r="2.2" fill="#818cf8" fillOpacity="0.85" />
          <defs>
            <linearGradient id="finleap-grad" x1="3" y1="7" x2="29" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 11. Vanguard Systems (Royal Indigo Nexus Shield on white backdrop)
  if (c.includes('vanguard')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <path d="M16 4l10 5v8c0 6.5-4.2 12.5-10 14-5.8-1.5-10-7.5-10-14V9l10-5z" fill="url(#vanguard-grad)" />
          <path d="M11 13l5 5 5-5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="vanguard-grad" x1="6" y1="4" x2="26" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#4338ca" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 12. DataForge Analytics (Amber / Orange 3D Data Prism on white backdrop)
  if (c.includes('dataforge') || c.includes('analytics')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <path d="M16 4l11 6v12l-11 6-11-6V10l11-6z" fill="url(#dataforge-grad)" />
          <path d="M16 4v24M5 10l11 6 11-6" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x="12" y="14" width="3" height="6" rx="1" fill="#ffffff" />
          <rect x="17" y="11" width="3" height="9" rx="1" fill="#ffffff" />
          <defs>
            <linearGradient id="dataforge-grad" x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 13. HyperGrowth Media (Coral Growth Rocket on white backdrop)
  if (c.includes('hypergrowth') || c.includes('growth')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <path d="M7 25c-1 1-2 3-2 3s2-1 3-2c1-1 1-2 0-2s-1 0-1 1z" fill="#f43f5e" />
          <path d="M18 6c-4 1-8 6-9 11l6 6c5-1 10-5 11-9 0-3-5-8-8-8z" fill="url(#hyper-grad)" />
          <circle cx="20" cy="12" r="2.5" fill="#ffffff" />
          <defs>
            <linearGradient id="hyper-grad" x1="9" y1="6" x2="26" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb7185" />
              <stop offset="1" stopColor="#e11d48" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 14. PixelCraft Labs (Isometric Design Cubes on white backdrop)
  if (c.includes('pixelcraft') || c.includes('pixel')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <rect x="5" y="5" width="9.5" height="9.5" rx="2" fill="#c084fc" />
          <rect x="17.5" y="5" width="9.5" height="9.5" rx="2" fill="#a855f7" />
          <rect x="5" y="17.5" width="9.5" height="9.5" rx="2" fill="#7e22ce" />
          <rect x="17.5" y="17.5" width="9.5" height="9.5" rx="2" fill="#ec4899" />
        </svg>
      </div>
    );
  }

  // 15. NeuralPulse AI (Neural Network Spark on white backdrop)
  if (c.includes('neuralpulse') || c.includes('neural') || c.includes('ai')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="4.5" fill="url(#neural-core)" />
          <circle cx="8" cy="8" r="2.5" fill="#6366f1" />
          <circle cx="24" cy="8" r="2.5" fill="#06b6d4" />
          <circle cx="8" cy="24" r="2.5" fill="#06b6d4" />
          <circle cx="24" cy="24" r="2.5" fill="#6366f1" />
          <line x1="10" y1="10" x2="13" y2="13" stroke="#94a3b8" strokeWidth="1.8" />
          <line x1="22" y1="10" x2="19" y2="13" stroke="#94a3b8" strokeWidth="1.8" />
          <line x1="10" y1="22" x2="13" y2="19" stroke="#94a3b8" strokeWidth="1.8" />
          <line x1="22" y1="22" x2="19" y2="19" stroke="#94a3b8" strokeWidth="1.8" />
          <defs>
            <linearGradient id="neural-core" x1="11" y1="11" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4f46e5" />
              <stop offset="1" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 16. Starlight Digital (Faceted Celestial Star on white backdrop)
  if (c.includes('starlight')) {
    return (
      <div className={baseContainer}>
        <svg className={s.icon} viewBox="0 0 32 32" fill="none">
          <path d="M16 2l3.5 10.5L30 16l-10.5 3.5L16 30l-3.5-10.5L2 16l10.5-3.5L16 2z" fill="url(#starlight-grad)" />
          <circle cx="16" cy="16" r="3" fill="#ffffff" />
          <defs>
            <linearGradient id="starlight-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 17. Netflix
  if (c.includes('netflix')) {
    return (
      <div className={baseContainer}>
        <span className="font-extrabold text-[#E50914] text-lg leading-none">N</span>
      </div>
    );
  }

  // 18. Spotify
  if (c.includes('spotify')) {
    return (
      <div className={baseContainer}>
        <svg className={`${s.icon} text-[#1DB954] fill-current`} viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </div>
    );
  }

  // 19. Stripe
  if (c.includes('stripe')) {
    return (
      <div className={baseContainer}>
        <span className="font-extrabold text-[#635BFF] text-base leading-none">S</span>
      </div>
    );
  }

  // 20. Default Corporate Emblem on clean white background
  const firstLetter = (company || 'C').charAt(0).toUpperCase();
  const colors = [
    'text-blue-600 bg-blue-50',
    'text-indigo-600 bg-indigo-50',
    'text-purple-600 bg-purple-50',
    'text-emerald-600 bg-emerald-50',
    'text-amber-600 bg-amber-50',
  ];
  const colorIndex = (company.charCodeAt(0) || 0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className={baseContainer}>
      <div className={`w-full h-full rounded-xl flex items-center justify-center font-black ${colorClass}`}>
        <span className={s.text}>{firstLetter}</span>
      </div>
    </div>
  );
}
