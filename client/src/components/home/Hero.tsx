import React from 'react';
import { SiteSettings } from '../../types';
import { ArrowRight, Utensils, Leaf, ChefHat, MapPin, Users } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
  onOpenOrderModal: () => void;
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings: _settings, onOpenOrderModal, onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-[#0A0705] text-white">
      {/* ─── Full Cinematic Photographic Background (Desktop & Mobile) ─── */}
      <div className="relative min-h-[720px] sm:min-h-[740px] lg:min-h-[660px] xl:min-h-[720px] flex flex-col justify-between">

        {/* Mobile Background Image (1000x1200 custom portrait hero image showing full coffee, golden dosa & complete thali platter) */}
        <div
          className="block lg:hidden absolute inset-0 bg-cover bg-no-repeat bg-[center_top]"
          style={{
            backgroundImage: `url('/images/hero-dosa-platter-mobile.jpg?v=20261022_v2')`,
          }}
          role="img"
          aria-label="Crisp golden South Indian masala dosa platter with traditional chutneys, sambar, and filter coffee"
        />

        {/* Desktop Background Image (Widescreen 16:9 filled background) */}
        <div
          className="hidden lg:block absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url('/images/hero-dosa-platter.jpg?v=20261022_v2')` }}
          role="img"
          aria-label="Crisp golden South Indian masala dosa platter with traditional chutneys, sambar, and filter coffee"
        />

        {/* Directional Cinematic Vignette & Shadow Overlays */}
        {/* Desktop: Horizontal darkening gradient to ensure text legibility on left */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/20 lg:to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0705] via-[#0A0705]/80 to-transparent pointer-events-none" />

        {/* Mobile: Minimal lightweight gradient strictly behind header & headline text, keeping the food 100% pure & vibrant */}
        <div className="block lg:hidden absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none" />
        <div className="block lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A0705] via-[#0A0705]/80 to-transparent pointer-events-none" />

        {/* ─── Main Hero Content Area (Overlaid on Background) ─── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 sm:pt-12 lg:pt-12 pb-4 sm:pb-6 flex-1 flex flex-col justify-between">

          {/* Top Text & Action Buttons */}
          <div className="max-w-xl space-y-2.5 sm:space-y-5 pt-0.5 sm:pt-0">
            {/* 100% Pure Veg • Gurugram Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-sm font-bold tracking-widest uppercase text-[#B2C8A8] drop-shadow-sm flex items-center gap-1.5">
                <span>100% PURE VEG</span>
                <span className="text-emerald-400/60">•</span>
                <span>GURUGRAM</span>
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0 fill-emerald-400/30" />
              </span>
            </div>

            {/* Signature Luxury Serif Headline */}
            <h1 className="font-serif-luxury text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-normal text-white tracking-tight leading-[1.08] drop-shadow-lg">
              Authentic <br />
              <span className="text-[#DEAC5D] italic font-serif-luxury font-normal">South Indian</span> <br />
              Flavours
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="text-gray-200/90 text-xs sm:text-base lg:text-lg max-w-md sm:max-w-lg leading-relaxed drop-shadow-md font-normal">
              Crispy dosas, soft idlis, flavourful uttapams and more — served with love since 2014 in Gurugram.
            </p>

            {/* Action Buttons: Solid Green Explore Menu + Outlined Order Online */}
            <div className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-4">
              <button
                onClick={() => onNavigate('/menu')}
                className="btn-shimmer interactive-press inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#168B4F] via-[#1aa05b] to-[#127742] text-white font-bold text-xs sm:text-base px-5 sm:px-7 py-2.5 sm:py-3 transition shadow-[0_8px_24px_rgba(22,139,79,0.45)] hover:shadow-[0_12px_32px_rgba(22,139,79,0.6)] cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                <span>Explore Menu</span>
              </button>

              <button
                onClick={onOpenOrderModal}
                className="interactive-press inline-flex items-center gap-2 rounded-full border border-white/50 hover:border-emerald-400 bg-black/40 hover:bg-emerald-950/30 text-white font-bold text-xs sm:text-base px-5 sm:px-7 py-2.5 sm:py-3 transition backdrop-blur-md cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(22,139,79,0.3)]"
              >
                <span>Order Online</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* ─── Bottom Floating Feature Bar (The 4 Badge Items) ─── */}
          <div className="w-full mt-4 sm:mt-10 lg:mt-14 pb-2 sm:pb-3">
            <div className="rounded-2xl lg:rounded-full bg-[#14100D]/85 backdrop-blur-md border border-white/15 px-4 sm:px-8 py-4 sm:py-3.5 shadow-2xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">

                {/* 1. 100% Pure Veg */}
                <div className="flex items-center gap-3 pt-2 lg:pt-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs sm:text-sm text-white tracking-wide">100% Pure Veg</h2>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">No Onion No Garlic (on request)</p>
                  </div>
                </div>

                {/* 2. Authentic Recipes */}
                <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:pl-6">
                  <div className="w-9 h-9 rounded-full bg-[#DEAC5D]/15 border border-[#DEAC5D]/30 flex items-center justify-center shrink-0">
                    <ChefHat className="w-4 h-4 text-[#DEAC5D]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs sm:text-sm text-white tracking-wide">Authentic Recipes</h2>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">Traditional South Indian Taste</p>
                  </div>
                </div>

                {/* 3. Serving Since 2014 */}
                <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:pl-6">
                  <div className="w-9 h-9 rounded-full bg-[#DEAC5D]/15 border border-[#DEAC5D]/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#DEAC5D]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs sm:text-sm text-white tracking-wide">Serving Since 2014</h2>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">Gurugram</p>
                  </div>
                </div>

                {/* 4. Parties & Catering */}
                <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:pl-6">
                  <div className="w-9 h-9 rounded-full bg-[#DEAC5D]/15 border border-[#DEAC5D]/30 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-[#DEAC5D]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs sm:text-sm text-white tracking-wide">Parties &amp; Catering</h2>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">Contact for Bulk Orders</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
