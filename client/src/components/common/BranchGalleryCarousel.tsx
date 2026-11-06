import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BranchGalleryItem } from '../../types';
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, Camera } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface BranchGalleryCarouselProps {
  gallery?: BranchGalleryItem[];
  fallbackImage: string;
  branchName: string;
  branchAddress?: string;
  hasDineIn?: boolean;
  aspectRatio?: string; // e.g., 'aspect-16/9' | 'aspect-4/3'
  className?: string;
  showThumbnails?: boolean;
}

export const BranchGalleryCarousel: React.FC<BranchGalleryCarouselProps> = ({
  gallery,
  fallbackImage,
  branchName,
  branchAddress,
  hasDineIn = false,
  aspectRatio = 'aspect-16/9',
  className = '',
  showThumbnails = true,
}) => {
  // Normalize items to BranchGalleryItem array
  const items: BranchGalleryItem[] =
    gallery && gallery.length > 0
      ? gallery
      : [
          {
            id: 'fallback',
            image: fallbackImage,
            title: branchName,
            subtitle: branchAddress,
            tag: 'Storefront',
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  const currentItem = items[currentIndex] || items[0];

  const goToNext = useCallback(() => {
    triggerHaptic('light');
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    triggerHaptic('light');
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToIndex = useCallback((idx: number) => {
    triggerHaptic('light');
    setCurrentIndex(idx);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, goToNext, goToPrev]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (total <= 1) return;
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setTouchDeltaX(0);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || !isSwiping) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - (touchStartY ?? touch.clientY);

    // If mostly horizontal movement, record delta
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setTouchDeltaX(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || touchStartX === null) {
      setIsSwiping(false);
      setTouchDeltaX(0);
      return;
    }

    const minSwipeDistance = 40; // minimum 40px swipe threshold
    if (touchDeltaX < -minSwipeDistance) {
      // Swiped Left -> Next Photo
      goToNext();
    } else if (touchDeltaX > minSwipeDistance) {
      // Swiped Right -> Previous Photo
      goToPrev();
    }

    setIsSwiping(false);
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchDeltaX(0);
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative overflow-hidden select-none group/carousel ${className}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image Container */}
        <div className={`relative ${aspectRatio} w-full overflow-hidden bg-neutral-950`}>
          {items.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={item.image}
                  alt={`${branchName} - ${item.title}`}
                  className="w-full h-full object-cover object-center group-hover/carousel:scale-105 transition-transform duration-700 ease-out"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}

          {/* Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none z-15" />

          {/* Top Header Overlay: Branch Name & Tag / Dine-In Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="glass-badge font-display font-black text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg text-emerald-300">
                {branchName}
              </span>
              {currentItem.tag && (
                <span className="bg-black/60 backdrop-blur-md border border-white/15 text-white/90 font-bold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {currentItem.tag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {hasDineIn && (
                <span className="bg-amber-500 text-white font-display font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Dine-In
                </span>
              )}
              {total > 1 && (
                <span className="bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
                  {currentIndex + 1} / {total}
                </span>
              )}
            </div>
          </div>

          {/* Big Navigation Buttons: Left (<) and Right (>) */}
          {total > 1 && (
            <>
              {/* BIG LEFT BUTTON (<) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                aria-label="Previous photo"
                className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/65 hover:bg-emerald-500 text-white border border-white/30 hover:border-emerald-400 flex items-center justify-center backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(22,139,79,0.7)] transition-all duration-200 active:scale-95 group/btn cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover/btn:-translate-x-0.5" />
              </button>

              {/* BIG RIGHT BUTTON (>) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next photo"
                className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/65 hover:bg-emerald-500 text-white border border-white/30 hover:border-emerald-400 flex items-center justify-center backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(22,139,79,0.7)] transition-all duration-200 active:scale-95 group/btn cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </>
          )}

          {/* Bottom Caption & Expand Fullscreen Button */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 z-20 pointer-events-none">
            <div className="space-y-0.5 max-w-[75%] sm:max-w-[80%] pointer-events-auto">
              <h4 className="font-display font-extrabold text-sm sm:text-base text-white drop-shadow-md leading-tight line-clamp-1">
                {currentItem.title}
              </h4>
              {currentItem.subtitle && (
                <p className="text-[11px] sm:text-xs text-gray-300 drop-shadow-sm line-clamp-1">
                  {currentItem.subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              title="View full-screen gallery"
              className="pointer-events-auto p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-emerald-500 text-white border border-white/20 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          {/* Mobile Swipe Hint Indicator (Fades out once user interacts) */}
          {total > 1 && (
            <div className="sm:hidden absolute bottom-12 left-1/2 -translate-x-1/2 z-15 pointer-events-none opacity-80 animate-pulse">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                ⇄ Swipe left / right
              </span>
            </div>
          )}
        </div>

        {/* Interactive Dots / Thumbnails Navigation */}
        {total > 1 && showThumbnails && (
          <div className="bg-[#121212] p-2.5 sm:p-3 border-t border-white/10 flex items-center justify-between gap-2">
            {/* Dots on small screens / mini thumbnails on larger screens */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {items.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToIndex(idx)}
                    className={`relative rounded-lg overflow-hidden transition-all duration-300 shrink-0 cursor-pointer ${
                      isActive
                        ? 'ring-2 ring-emerald-400 scale-105 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                        : 'opacity-55 hover:opacity-90 hover:scale-100'
                    }`}
                    style={{ width: '48px', height: '32px' }}
                    title={item.title}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-emerald-500/20 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Gallery Mode Pill */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="glass-pill interactive-press text-[11px] font-bold text-emerald-400 hover:text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Full Gallery ({total})</span>
            </button>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fadeIn select-none"
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between w-full max-w-6xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="glass-badge font-display font-black text-xs sm:text-sm px-4 py-1.5 rounded-full text-emerald-300">
                {branchName} — Gallery
              </span>
              <span className="text-xs sm:text-sm font-mono text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                {currentIndex + 1} of {total}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Area with Big Left & Right Buttons */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* BIG PREV BUTTON (<) IN LIGHTBOX */}
            {total > 1 && (
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-4 z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/70 hover:bg-emerald-500 text-white border border-white/30 hover:border-emerald-400 flex items-center justify-center backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all duration-200 active:scale-95 group/lb-btn cursor-pointer"
              >
                <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 transition-transform group-hover/lb-btn:-translate-x-1" />
              </button>
            )}

            {/* Photo */}
            <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={currentItem.image}
                alt={`${branchName} - ${currentItem.title}`}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* BIG NEXT BUTTON (>) IN LIGHTBOX */}
            {total > 1 && (
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next photo"
                className="absolute right-2 sm:right-4 z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/70 hover:bg-emerald-500 text-white border border-white/30 hover:border-emerald-400 flex items-center justify-center backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all duration-200 active:scale-95 group/lb-btn cursor-pointer"
              >
                <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 transition-transform group-hover/lb-btn:translate-x-1" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Title, Subtitle & Interactive Thumbnail Ribbon */}
          <div
            className="w-full max-w-4xl mx-auto space-y-3 z-10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                {currentItem.tag && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase">
                    {currentItem.tag}
                  </span>
                )}
                <h3 className="font-display font-bold text-base sm:text-xl text-white">
                  {currentItem.title}
                </h3>
              </div>
              {currentItem.subtitle && (
                <p className="text-xs sm:text-sm text-gray-300">
                  {currentItem.subtitle}
                </p>
              )}
            </div>

            {/* Thumbnail Strip */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
                {items.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goToIndex(idx)}
                      className={`relative rounded-lg overflow-hidden transition-all duration-200 shrink-0 cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-emerald-400 scale-110 shadow-[0_0_16px_rgba(52,211,153,0.5)]'
                          : 'opacity-50 hover:opacity-90'
                      }`}
                      style={{ width: '56px', height: '38px' }}
                      title={item.title}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <p className="text-[11px] text-gray-400">
              <span className="hidden sm:inline">Use Left/Right arrow keys or click the big buttons to navigate • Press Esc to close</span>
              <span className="sm:hidden">Swipe left / right or tap big arrow buttons to navigate photos</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

