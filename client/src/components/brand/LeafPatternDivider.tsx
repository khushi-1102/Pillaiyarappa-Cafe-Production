import React from 'react';

interface LeafPatternDividerProps {
  className?: string;
  withCenterMedallion?: boolean;
}

export const LeafPatternDivider: React.FC<LeafPatternDividerProps> = ({
  className = '',
  withCenterMedallion = true,
}) => {
  return (
    <div
      className={`w-full flex items-center justify-center select-none py-4 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-white/5" />
        {withCenterMedallion && (
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-gray-300">
              100% Pure Veg • Gurugram
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        )}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-white/5" />
      </div>
    </div>
  );
};
