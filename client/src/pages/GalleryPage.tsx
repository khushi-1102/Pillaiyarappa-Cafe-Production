import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { VineDivider } from '../components/brand/VineDivider';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

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
    <div className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge">
            Real Food &amp; Storefronts
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Gallery
          </h1>
          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Authentic photography of our signature crispy dosas, fresh idlis, and Gurugram restaurant storefronts.
          </p>
        </div>

        <VineDivider className="mb-8" />

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider interactive-press transition ${
              filter === 'all'
                ? 'btn-shimmer bg-emerald-500 text-white shadow-[0_4px_16px_rgba(22,139,79,0.35)] font-extrabold'
                : 'glass-pill text-gray-300 hover:text-white'
            }`}
          >
            All Photos ({gallery.length})
          </button>
          <button
            onClick={() => setFilter('food')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider interactive-press transition ${
              filter === 'food'
                ? 'btn-shimmer bg-emerald-500 text-white shadow-[0_4px_16px_rgba(22,139,79,0.35)] font-extrabold'
                : 'glass-pill text-gray-300 hover:text-white'
            }`}
          >
            Food Dishes ({gallery.filter((g) => g.category === 'food').length})
          </button>
          <button
            onClick={() => setFilter('restaurant')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider interactive-press transition ${
              filter === 'restaurant'
                ? 'btn-shimmer bg-emerald-500 text-white shadow-[0_4px_16px_rgba(22,139,79,0.35)] font-extrabold'
                : 'glass-pill text-gray-300 hover:text-white'
            }`}
          >
            Restaurant &amp; Branches ({gallery.filter((g) => g.category === 'restaurant').length})
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(idx)}
              aria-label={`Open photo lightbox: ${item.title}`}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full glass-badge flex items-center justify-center text-emerald-300 shadow-xl group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] flex items-center justify-between border-t border-white/5">
                <div>
                  <p className="font-display font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">
                    {item.category === 'food' ? 'Fresh Food Creation' : 'Gurugram Branch'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal with Keyboard accessibility */}
        {activeIndex !== null && filteredItems[activeIndex] && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-fade-in"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full glass-pill text-white hover:text-emerald-400 interactive-press transition"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav */}
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-pill text-white hover:text-emerald-400 interactive-press transition"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav */}
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-pill text-white hover:text-emerald-400 interactive-press transition"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Content */}
            <div className="max-w-4xl w-full max-h-[85vh] flex flex-col rounded-3xl overflow-hidden glass-panel-elevated shadow-2xl">
              <div className="relative flex-1 bg-black/80 flex items-center justify-center overflow-hidden min-h-[300px]">
                <img
                  src={filteredItems[activeIndex].image}
                  alt={filteredItems[activeIndex].alt}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-between border-t border-white/10 bg-black/40">
                <div>
                  <h3 id="lightbox-title" className="font-display font-bold text-base text-emerald-400">
                    {filteredItems[activeIndex].title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">{filteredItems[activeIndex].alt}</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono px-3 py-1 rounded-full glass-badge">
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
