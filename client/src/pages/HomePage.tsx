import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { VineDivider } from '../components/brand/VineDivider';
import { CategoryCards } from '../components/home/CategoryCards';
import { ActionTiles } from '../components/home/ActionTiles';
import { BranchSection } from '../components/home/BranchSection';
import { SiteSettings, MenuCategory, Branch, GalleryItem, Offer, MenuItem } from '../types';
import { Star, ShieldCheck, Heart, Sparkles, ArrowRight, ChevronRight, X } from 'lucide-react';

interface HomePageProps {
  settings: SiteSettings;
  categories: MenuCategory[];
  items?: MenuItem[];
  branches: Branch[];
  gallery: GalleryItem[];
  offers: Offer[];
  onNavigate: (path: string) => void;
  onOpenOrderModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  categories,
  items,
  branches,
  gallery,
  offers,
  onNavigate,
  onOpenOrderModal,
}) => {
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<GalleryItem | null>(null);

  const handleSelectCategory = (slug: string) => {
    onNavigate(`/menu#${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* 1. Hero Section matching reference */}
      <Hero
        settings={settings}
        onOpenOrderModal={onOpenOrderModal}
        onNavigate={onNavigate}
      />

      {/* 2. Signature Green Vine Divider */}
      <VineDivider className="my-1 sm:my-3" />

      {/* 3. Our Menu Preview: Interactive Card Menu Showcase */}
      <CategoryCards
        categories={categories}
        items={items}
        onSelectCategory={handleSelectCategory}
        onNavigateToMenu={() => onNavigate('/menu')}
      />

      {/* 4. Quick Action Row: 4 Tiles */}
      <ActionTiles
        settings={settings}
        onOpenOrderModal={onOpenOrderModal}
        onNavigate={onNavigate}
      />

      {/* 5. Our Branches Preview: Two Branch Cards / Mobile Accordion */}
      <BranchSection
        branches={branches}
        onNavigateToBranches={() => onNavigate('/branches')}
      />

      {/* 6. Curated Real Food Gallery Section */}
      <section className="py-10 sm:py-14 bg-transparent border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                Visual Feast
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Food &amp; Dining Gallery
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/gallery')}
              className="glass-pill interactive-press text-xs font-bold text-white hover:text-emerald-300 px-4 py-2 rounded-full flex items-center gap-1.5 transition"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {gallery.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGalleryImg(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedGalleryImg(item)}
                aria-label={`View photo: ${item.title}`}
                className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer group glass-card"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 text-center">
                  <span className="text-xs font-bold text-emerald-300 drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why Choose Pillaiyarappa (Authenticity & Quality) */}
      <section className="py-12 bg-black/40 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge">
              Pure Vegetarian Promise
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Why Gurugram Loves Pillaiyarappa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl glass-card flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-2xl glass-badge text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                  Authentic Traditional Recipes
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Naturally fermented batters, freshly ground spice blends, and authentic coconut chutneys made fresh every morning.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl glass-card flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-2xl glass-badge text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                  100% Pure Vegetarian
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Dedicated pure vegetarian kitchen adhering to the highest standards of hygiene and authentic South Indian culinary purity.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl glass-card flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-2xl glass-badge text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                  Two Gurugram Locations
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Proudly serving South City-1 (Opp. Mayom Hospital) and Sector-40 Huda Market with lightning-fast local delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Catering CTA Banner */}
      <section className="py-12 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-elevated rounded-3xl p-8 sm:p-12 text-center space-y-4 relative overflow-hidden border border-emerald-500/30">
            {/* Ambient decorative glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge relative">
              Parties &amp; Bulk Orders
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight relative">
              Planning an Event, Puja, or Office Gathering?
            </h2>
            <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed relative">
              From live crispy Dosa counters to authentic South Indian thalis and piping hot Filter Kaapi setups, Pillaiyarappa caters for all party sizes across Gurugram.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5 relative">
              <button
                onClick={() => onNavigate('/catering')}
                className="btn-shimmer interactive-press rounded-full bg-emerald-500 px-8 py-3.5 font-display font-black text-xs uppercase tracking-wider text-white hover:bg-emerald-400 transition shadow-[0_8px_28px_rgba(22,139,79,0.4)]"
              >
                Get Catering Quote Now
              </button>
              <a
                href={`tel:+91${settings.phonePrimary}`}
                className="glass-pill interactive-press rounded-full px-7 py-3.5 font-bold text-xs uppercase tracking-wider text-white hover:text-emerald-300 transition"
              >
                Call 9899101195
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for gallery preview */}
      {selectedGalleryImg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-3xl overflow-hidden glass-panel-elevated shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full glass-pill text-white hover:text-emerald-400 interactive-press transition"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedGalleryImg.image}
              alt={selectedGalleryImg.alt}
              className="w-full max-h-[80vh] object-contain bg-black/70"
            />
            <div className="p-4 sm:p-5 bg-black/50 border-t border-white/10 flex items-center justify-between">
              <p className="font-bold text-sm text-emerald-400">{selectedGalleryImg.title}</p>
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Pillaiyarappa Special</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
