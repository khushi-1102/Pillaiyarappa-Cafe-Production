import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Hero } from '../components/home/Hero';
import { VineDivider } from '../components/brand/VineDivider';
import { CategoryCards } from '../components/home/CategoryCards';
import { ActionTiles } from '../components/home/ActionTiles';
import { BranchSection } from '../components/home/BranchSection';
import { SiteSettings, MenuCategory, Branch, GalleryItem, Offer, MenuItem } from '../types';
import { Star, ShieldCheck, Heart, Sparkles, ArrowRight, ChevronRight, X, Eye } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight, scaleIn, staggerContainer, staggerFast, viewportOnce } from '../utils/animations';

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
      <motion.section
        className="py-10 sm:py-14 bg-transparent border-t border-white/5 relative"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#DEAC5D]" />
                Visual Feast
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                <span className="gold-gradient-text">Food &amp; Dining Gallery</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/gallery')}
              className="glass-pill interactive-press text-xs font-bold text-white hover:text-[#DEAC5D] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-1.5 border border-white/10 hover:border-[#DEAC5D]/40 transition"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DEAC5D]" />
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5"
            variants={staggerFast}
          >
            {gallery.slice(0, 6).map((item) => (
              <motion.div
                key={item.id}
                variants={scaleIn}
                whileHover={{ scale: 1.03, y: -3 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedGalleryImg(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedGalleryImg(item)}
                aria-label={`View photo: ${item.title}`}
                className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-square cursor-pointer group luxury-card border border-white/10 hover:border-[#DEAC5D]/70 transition-all duration-500 shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_28px_rgba(222,172,93,0.22)] bg-[#121212]"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out transform-gpu"
                  loading="lazy"
                  decoding="async"
                />

                {/* Category micro badge */}
                <div className="absolute top-2 left-2 z-10 pointer-events-none">
                  <span className="px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#DEAC5D]">
                    {item.category === 'food' ? 'Pure Veg' : 'Branch'}
                  </span>
                </div>

                {/* Center eye icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-[#DEAC5D]/60 flex items-center justify-center text-[#DEAC5D] shadow-[0_0_15px_rgba(222,172,93,0.35)] scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom luxury gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 pt-6 pb-2 px-2.5 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end pointer-events-none z-10">
                  <span className="text-[11px] sm:text-xs font-display font-bold text-white group-hover:text-[#DEAC5D] truncate transition-colors drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 7. Why Choose Pillaiyarappa (Authenticity & Quality) */}
      <motion.section
        className="py-12 bg-black/40 border-t border-white/5 relative"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center space-y-2 mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider gold-badge">
              Pure Vegetarian Promise
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Why Gurugram Loves <span className="gold-gradient-text">Pillaiyarappa</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Authentic Traditional Recipes', desc: 'Naturally fermented stone-ground batters, freshly roasted spice blends, and authentic coconut chutneys made fresh every single morning.' },
              { icon: ShieldCheck, title: '100% Pure Vegetarian Kitchen', desc: 'Dedicated pure vegetarian kitchen adhering to the highest standards of hygiene and authentic South Indian culinary purity.' },
              { icon: Heart, title: 'Two Gurugram Locations', desc: 'Proudly serving South City-1 (Opp. Mayom Hospital) and Sector-40 Huda Market with lightning-fast local delivery.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 sm:p-7 rounded-3xl luxury-card flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(22,139,79,0.2)]">
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 8. Catering CTA Banner */}
      <motion.section
        className="py-12 sm:py-16 relative"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scaleIn}
            className="glass-panel-elevated rounded-3xl p-8 sm:p-12 text-center space-y-4 relative overflow-hidden border border-emerald-500/30"
          >
            {/* Ambient decorative glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider gold-badge relative">
              Parties &amp; Royal Catering
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight relative">
              Planning an Event, Puja, or <span className="gold-gradient-text">Celebration?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed relative">
              From live crispy Dosa counters to authentic South Indian thalis and piping hot Filter Kaapi setups, Pillaiyarappa caters for all party sizes across Gurugram.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-3 flex flex-wrap items-center justify-center gap-3.5 relative">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate('/catering')}
                className="btn-shimmer interactive-press rounded-full bg-gradient-to-r from-[#168B4F] via-[#1aa05b] to-[#127742] border border-emerald-400/50 px-8 py-3.5 font-display font-black text-xs uppercase tracking-wider text-white hover:brightness-110 transition shadow-[0_8px_28px_rgba(22,139,79,0.5),inset_0_1px_0_0_rgba(255,255,255,0.25)] cursor-pointer"
              >
                Get Royal Catering Quote
              </motion.button>
              <a
                href={`tel:+91${settings.phonePrimary}`}
                className="glass-pill interactive-press rounded-full px-7 py-3.5 font-bold text-xs uppercase tracking-wider text-white hover:text-emerald-300 transition"
              >
                Call {settings.phonePrimary}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Lightbox Modal for gallery preview */}
      {selectedGalleryImg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-4 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl sm:rounded-3xl overflow-hidden glass-panel-elevated shadow-2xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full glass-pill text-white hover:text-[#DEAC5D] border border-white/15 interactive-press transition"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedGalleryImg.image}
              alt={selectedGalleryImg.alt}
              className="w-full max-h-[75vh] object-contain bg-black/80"
            />
            <div className="p-3.5 sm:p-4 bg-black/60 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-sm sm:text-base text-[#DEAC5D]">{selectedGalleryImg.title}</p>
                <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">{selectedGalleryImg.alt}</p>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#DEAC5D] uppercase font-bold px-3 py-1 rounded-full gold-badge">
                Pillaiyarappa Special
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
