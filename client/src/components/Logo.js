'use client';
import Link from 'next/link';

export default function Logo({ size = 'md', white = false, href = '/' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const iconWidth = isLg ? 36 : isSm ? 22 : 28;
  const iconHeight = Math.round(iconWidth * 0.625);
  const textSize = isLg ? 'text-2xl' : isSm ? 'text-base' : 'text-xl';
  const textColor = white ? 'text-white' : 'text-gray-900';

  const content = (
    <span className="inline-flex items-center gap-2.5 font-bold tracking-tight select-none group">
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 40 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200 group-hover:scale-105"
      >
        <path
          d="M11 6C7.5 6 4 8.5 4 12.5C4 16.5 7.5 19 11 19C15.5 19 18.5 14 20 12.5C21.5 14 24.5 19 29 19C32.5 19 36 16.5 36 12.5C36 8.5 32.5 6 29 6C24.5 6 21.5 11 20 12.5C18.5 11 15.5 6 11 6Z"
          stroke={white ? '#ffffff' : 'url(#hireloop-infinity-grad)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="hireloop-infinity-grad" x1="4" y1="6" x2="36" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`${textSize} ${textColor} font-extrabold tracking-tight`}>
        HireLoop
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center no-underline">
        {content}
      </Link>
    );
  }
  return content;
}
