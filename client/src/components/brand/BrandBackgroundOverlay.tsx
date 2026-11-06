import React from 'react';

/**
 * BrandBackgroundOverlay provides an ultra-premium subtle ambiance:
 * - Dynamic drifting ambient emerald glow orbs with hardware acceleration
 * - Soft radial backdrop gradients giving rich depth behind cards
 * - Delicate, barely-there traditional Kolam geometric watermarks
 * - Fully non-intrusive: pointer-events-none and low contrast for 100% legibility
 */
export const BrandBackgroundOverlay: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Primary Drifting Ambient Emerald Glow Orb (Top-Right) */}
      <div
        className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] animate-orb-1"
        style={{ willChange: 'transform' }}
      />

      {/* 2. Secondary Ambient Warm Forest Glow Orb (Bottom-Left) */}
      <div
        className="absolute top-1/2 -left-32 w-[600px] h-[600px] rounded-full bg-emerald-600/8 blur-[150px] animate-orb-2"
        style={{ willChange: 'transform' }}
      />

      {/* 3. Subtle Center Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,9,0.5)_100%)]" />

      {/* 4. Top-Left Traditional Geometric Kolam Motif (delicate, low opacity) */}
      <svg
        className="absolute top-20 left-4 sm:left-8 w-36 sm:w-56 h-36 sm:h-56 text-emerald-400 opacity-[0.035] transition-opacity"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="100" cy="100" r="90" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="30" />
        <path d="M 100 10 Q 120 60 100 100 Q 80 60 100 10 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M 100 190 Q 120 140 100 100 Q 80 140 100 190 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M 10 100 Q 60 120 100 100 Q 60 80 10 100 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M 190 100 Q 140 120 100 100 Q 140 80 190 100 Z" fill="currentColor" fillOpacity="0.1" />
      </svg>

      {/* 5. Bottom-Right Subtle Kolam Watermark */}
      <svg
        className="absolute bottom-24 right-4 sm:right-12 w-48 sm:w-72 h-48 sm:h-72 text-emerald-400 opacity-[0.025]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="100" cy="100" r="85" strokeDasharray="6 6" />
        <circle cx="100" cy="100" r="50" />
        <polygon points="100,20 180,100 100,180 20,100" strokeWidth="1" />
        <polygon points="100,35 165,100 100,165 35,100" strokeWidth="0.8" />
      </svg>
    </div>
  );
};
