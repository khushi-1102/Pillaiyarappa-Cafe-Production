import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GalleryItem } from '../types';
import { VineDivider } from '../components/brand/VineDivider';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { scaleIn, staggerFast, viewportOnce } from '../utils/animations';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [filter, setFilter] = useState<'all' | 'food' | 'restaurant'>('all');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredItems = gallery.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredItems.length]);

  return (
    <div className="min-h-screen bg-[#090909] text-white py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2.5 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider gold-badge">
            <Sparkles className="w-3 h-3 text-[#DEAC5D]" />
            <span>Pure South Indian Elegance</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight">
            <span className="gold-gradient-text">Visual Gallery</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
            Authentic glimpses of our crisp ghee dosas, traditional filter coffee, and Gurugram restaurant ambiance.
          </p>
        </div>

        <VineDivider className="mb-6 sm:mb-8" />

        {/* Ultra-Premium Compact Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider interactive-press transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#168B4F] to-[#127742] text-white border border-emerald-400/40 shadow-[0_2px_14px_rgba(22,139,79,0.35)] font-extrabold'
                : 'glass-pill text-gray-300 hover:text-white hover:border-[#DEAC5D]/40'
            }`}
          >
            All Photos <span className="opacity-80 text-[10px]">({gallery.length})</span>
          </button>
          <button
            onClick={() => setFilter('food')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider interactive-press transition-all duration-300 ${
              filter === 'food'
                ? 'bg-gradient-to-r from-[#168B4F] to-[#127742] text-white border border-emerald-400/40 shadow-[0_2px_14px_rgba(22,139,79,0.35)] font-extrabold'
                : 'glass-pill text-gray-300 hover:text-white hover:border-[#DEAC5D]/40'
            }`}
          >
            Culinary Dishes <span className="opacity-80 text-[10px]">({gallery.filter((g) => g.category === 'food').length})</span>
          </button>
          <button
            onClick={() => setFilter('restaurant')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider interactive-press transition-all duration-300 ${
              filter === 'restaurant'
                ? 'bg-gradient-to-r from-[#168B4F] to-[#127742] text-white border border-emerald-400/40 shadow-[0_2px_14px_rgba(22,139,79,0.35)] font-extrabold'
                : 'glass-pill text-gray-300 hover:text-white hover:border-[#DEAC5D]/40'
            }`}
          >
            Branches &amp; Ambience <span className="opacity-80 text-[10px]">({gallery.filter((g) => g.category === 'restaurant').length})</span>
          </button>
        </div>

        {/* Compact Ultra-Premium Photos Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3.5 lg:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerFast}
        >
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={scaleIn}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(idx)}
              aria-label={`Open photo lightbox: ${item.title}`}
              className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group luxury-card border border-white/10 hover:border-[#DEAC5D]/70 transition-all duration-500 shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_28px_rgba(222,172,93,0.2)] bg-[#121212]"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out transform-gpu"
                loading="lazy"
                decoding="async"
              />

              {/* Category micro badge */}
              <div className="absolute top-2 left-2 z-10 pointer-events-none">
                <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#DEAC5D] shadow-sm">
                  {item.category === 'food' ? 'Pure Veg' : 'Branch'}
                </span>
              </div>

              {/* Center hover eye icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 backdrop-blur-md border border-[#DEAC5D]/60 flex items-center justify-center text-[#DEAC5D] shadow-[0_0_15px_rgba(222,172,93,0.35)] scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom seamless luxury gradient overlay with micro-typography */}
              <div className="absolute inset-x-0 bottom-0 pt-8 pb-2.5 px-2.5 sm:px-3 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end pointer-events-none z-10">
                <p className="font-display font-bold text-[11px] sm:text-xs text-white group-hover:text-[#DEAC5D] transition-colors leading-tight line-clamp-1 drop-shadow-md">
                  {item.title}
                </p>
                <span className="text-[9px] sm:text-[10px] text-gray-300 font-medium tracking-wide line-clamp-1 mt-0.5">
                  {item.category === 'food' ? 'Signature Creation' : 'Gurugram Storefront'}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox Modal with Keyboard accessibility */}
        {activeIndex !== null && filteredItems[activeIndex] && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-4 backdrop-blur-xl animate-fade-in"
            onClick={() => setActiveIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full glass-pill text-white hover:text-[#DEAC5D] border border-white/15 interactive-press transition"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Left Nav */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
                );
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full glass-pill text-white hover:text-[#DEAC5D] border border-white/15 interactive-press transition"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Nav */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) =>
                  prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full glass-pill text-white hover:text-[#DEAC5D] border border-white/15 interactive-press transition"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Main Content */}
            <div
              className="max-w-4xl w-full max-h-[85vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden glass-panel-elevated shadow-2xl border border-white/15"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-1 bg-black/85 flex items-center justify-center overflow-hidden min-h-[260px] sm:min-h-[350px]">
                <img
                  src={filteredItems[activeIndex].image}
                  alt={filteredItems[activeIndex].alt}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="p-3.5 sm:p-4 flex items-center justify-between border-t border-white/10 bg-black/60">
                <div>
                  <h3 id="lightbox-title" className="font-display font-bold text-sm sm:text-base text-[#DEAC5D]">
                    {filteredItems[activeIndex].title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">{filteredItems[activeIndex].alt}</p>
                </div>
                <span className="text-[11px] sm:text-xs text-[#DEAC5D] font-mono px-3 py-1 rounded-full gold-badge">
                  {activeIndex + 1} / {filteredItems.length}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
