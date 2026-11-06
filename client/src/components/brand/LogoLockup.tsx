import React from 'react';

interface LogoLockupProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
}

export const LogoLockup: React.FC<LogoLockupProps> = ({
  className = '',
  size = 'responsive',
}) => {
  // Dimensions matching high-DPI raster crispness with padding (1013x380 aspect ratio ~2.66)
  const dimensions = {
    sm: { width: 170, height: 64 },
    md: { width: 230, height: 86 },
    lg: { width: 290, height: 109 },
    responsive: { width: 235, height: 88 },
  }[size];

  return (
    <div
      className={`select-none focus:outline-none transition-transform hover:scale-[1.01] flex items-center justify-center ${className}`}
      role="img"
      aria-label="Pillaiyarappa South Indian Corner Official Logo"
    >
      <picture className="flex justify-center">
        <source srcSet="/brand/logo.webp" type="image/webp" />
        <img
          src="/brand/logo.png"
          alt="Pillaiyarappa South Indian Corner"
          width={dimensions.width}
          height={dimensions.height}
          className={`h-auto object-contain block drop-shadow-md ${
            size === 'responsive'
              ? 'w-[145px] xs:w-[165px] sm:w-[210px] md:w-[235px] max-h-[46px] xs:max-h-[52px] sm:max-h-[74px]'
              : ''
          }`}
          style={
            size !== 'responsive'
              ? {
                  width: `${dimensions.width}px`,
                  maxHeight: `${dimensions.height}px`,
                }
              : undefined
          }
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
};

