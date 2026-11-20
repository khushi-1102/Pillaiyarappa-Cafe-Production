import React from 'react';

interface VineDividerProps {
  className?: string;
}

export const VineDivider: React.FC<VineDividerProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-full overflow-hidden flex items-center justify-center py-4 sm:py-6 ${className}`}
      aria-hidden="true"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4">
        {/* Sleek Gradient Hairline */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-white/5" />
        
        {/* Subtle Elegant Temple Brass & Emerald Center Accents */}
        <div className="flex items-center gap-2 text-xs select-none">
          <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_6px_#168B4F]" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#DEAC5D]/70 bg-[#DEAC5D]/20 shadow-[0_0_8px_rgba(222,172,93,0.3)]" />
          <span className="w-2.5 h-2.5 rotate-45 border border-emerald-400 bg-emerald-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(22,139,79,0.5)]">
            <span className="w-1 h-1 rounded-full bg-[#DEAC5D]" />
          </span>
          <span className="w-1.5 h-1.5 rotate-45 border border-[#DEAC5D]/70 bg-[#DEAC5D]/20 shadow-[0_0_8px_rgba(222,172,93,0.3)]" />
          <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_6px_#168B4F]" />
        </div>

        {/* Sleek Gradient Hairline */}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-white/5" />
      </div>
    </div>
  );
};
