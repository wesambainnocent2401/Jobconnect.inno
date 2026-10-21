/**
 * JobConnect Official Gold Circular Badge Logo
 * Briefcase with two connected dots symbolizing Employer & Job Seeker connection
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  const textMap = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-3xl font-bold tracking-tight',
    xl: 'text-4xl font-bold tracking-tight'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative shrink-0 ${sizeMap[size]}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
        >
          <defs>
            <radialGradient id="logoBadgeGlow" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#2c251b" />
              <stop offset="100%" stopColor="#111014" />
            </radialGradient>
            <linearGradient id="logoGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3c4" />
              <stop offset="35%" stopColor="#f5d77a" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8a6a14" />
            </linearGradient>
            <linearGradient id="logoGoldCase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff0b8" />
              <stop offset="40%" stopColor="#e8be48" />
              <stop offset="80%" stopColor="#c49726" />
              <stop offset="100%" stopColor="#8a6a14" />
            </linearGradient>
          </defs>

          {/* Outer circular badge */}
          <circle cx="50" cy="50" r="46" fill="url(#logoBadgeGlow)" stroke="url(#logoGoldRing)" strokeWidth="3.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1" />

          {/* Briefcase Handle */}
          <path d="M38 37 V29 C38 25 62 25 62 29 V37" fill="none" stroke="url(#logoGoldRing)" strokeWidth="3" strokeLinecap="round" />

          {/* Briefcase Body */}
          <rect x="25" y="37" width="50" height="36" rx="6" fill="url(#logoGoldCase)" />
          
          {/* Briefcase Seam & Clasp */}
          <path d="M25 50 Q50 54 75 50" fill="none" stroke="#684e0c" strokeWidth="1.5" />
          <rect x="46" y="46" width="8" height="8" rx="2" fill="#fff3c4" stroke="#8a6a14" strokeWidth="1" />

          {/* Connected dots (Employer & Worker) */}
          <line x1="36" y1="61" x2="64" y2="61" stroke="#121116" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="36" cy="61" r="3.8" fill="#121116" stroke="#fff3c4" strokeWidth="1.2" />
          <circle cx="64" cy="61" r="3.8" fill="#121116" stroke="#fff3c4" strokeWidth="1.2" />
        </svg>
      </div>

      {showText && (
        <span className={`font-serif ${textMap[size]} text-gold-gradient`}>
          Job<span className="text-[#f5d77a]">Connect</span>
        </span>
      )}
    </div>
  );
};
