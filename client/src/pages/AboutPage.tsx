import React from 'react';
import { SiteSettings, Branch } from '../types';
import { VineDivider } from '../components/brand/VineDivider';
import { ShieldCheck, Heart, Sparkles, MapPin, Phone, Award, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  settings: SiteSettings;
  branches: Branch[];
  onNavigate: (path: string) => void;
  onOpenOrderModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  branches,
  onNavigate,
  onOpenOrderModal,
}) => {
  return (
    <div className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>ESTABLISHED 2014 • OVER A DECADE OF TRUST</span>
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Serving Gurugram Since 2014
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white">Pillaiyarappa — South Indian Corner</strong>. For more than 12 years, we have been crafting heartfelt, authentic, pure vegetarian culinary traditions for food lovers across Gurugram.
          </p>
        </div>

        <VineDivider className="mb-10" />

        {/* Milestone Stats Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="p-5 sm:p-6 rounded-2xl glass-card text-center space-y-1 border border-emerald-500/20">
            <div className="text-2xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              2014
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Year Founded</p>
            <p className="text-[11px] text-gray-400">Pioneering taste in Gurugram</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl glass-card text-center space-y-1 border border-emerald-500/20">
            <div className="text-2xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              12+ Years
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Culinary Legacy</p>
            <p className="text-[11px] text-gray-400">Serving authentic recipes</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl glass-card text-center space-y-1 border border-emerald-500/20">
            <div className="text-2xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              10AM – 10PM
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Open Everyday</p>
            <p className="text-[11px] text-gray-400">All 7 days a week</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl glass-card text-center space-y-1 border border-emerald-500/20">
            <div className="text-2xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              100% Pure
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Vegetarian</p>
            <p className="text-[11px] text-gray-400">No soda • No artificial colors</p>
          </div>
        </div>

        {/* Story Section with Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-5 text-gray-300 text-sm sm:text-base leading-relaxed">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Devotion In Every Dish Since 2014</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              The Essence of <span className="text-emerald-400">Authentic South Indian</span> Flavours
            </h2>
            <p>
              Started in <strong className="text-white">2014</strong> with profound reverence and love for traditional cooking, <strong className="text-white">Pillaiyarappa — South Indian Corner</strong> was founded with a singular purpose: to bring uncompromised, genuine homestyle South Indian vegetarian cuisine to the residents and professionals of Gurugram.
            </p>
            <p>
              Over the last 12+ years, while the city transformed, our kitchen values remained sacred. Every single morning, our seasoned chefs start at dawn with traditional preparations: grinding fresh coconuts for our signature coconut chutney, slow-simmering aromatic toor dal sambar with fresh drumsticks and hand-pounded spices, and pouring naturally aged batter onto seasoned tawas.
            </p>
            <p>
              We maintain absolute honesty in food. That means <strong className="text-white">100% pure vegetarian cuisine</strong> prepared with zero artificial food colors, zero chemical additives, and genuine desi ghee and cold-pressed sesame oil where traditional recipes call for it.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/menu')}
                className="btn-shimmer interactive-press rounded-full bg-emerald-500 px-6 py-3 font-display font-black text-xs uppercase tracking-wider text-white hover:bg-emerald-400 transition shadow-[0_8px_24px_rgba(22,139,79,0.35)]"
              >
                Browse Our Menu
              </button>
              <button
                onClick={() => onNavigate('/catering')}
                className="glass-pill interactive-press rounded-full px-6 py-3 font-bold text-xs uppercase tracking-wider text-white hover:text-emerald-300 transition"
              >
                Catering Inquiries
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel-elevated rounded-3xl p-2 sm:p-3 relative group">
              <div className="rounded-2xl overflow-hidden aspect-4/3 relative bg-neutral-900">
                <img
                  src="/images/about-south-indian-heritage.jpg"
                  alt="Authentic South Indian Heritage Feast - Crispy Masala Dosa, Soft Idlis, Medu Vada, Sambar, Chutneys and Filter Kaapi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 glass-panel rounded-xl p-3 border border-white/10 shadow-lg">
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Serving Gurugram Since 2014</span>
                  </p>
                  <p className="text-[11px] text-gray-300 mt-0.5">12+ Years of Uncompromising Vegetarian Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="mb-16">
          <div className="text-center space-y-2 mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Our 4 Pillars of Excellence
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Rooted in centuries-old Vedic cooking wisdom and pure vegetarian discipline since 2014.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-3xl space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                12-Hour Natural Fermentation
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Batters are naturally aged for 12+ hours to yield crisp, airy dosas and fluffy, feather-light idlis without any soda.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                100% Pure Vegetarian
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Strict Vedic kitchen discipline. Purity and hygiene are non-negotiable across both Gurugram outlets.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                Kumbakonam Filter Coffee
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Traditional South Indian filter coffee brewed with fresh rich decoction, frothy hot milk, and served in dabarah tumblers.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                10:00 AM – 10:00 PM Daily
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Reliable all 7 days service for breakfast, hearty lunches, evening tiffins, and late family dinners across Gurugram.
              </p>
            </div>
          </div>
        </div>

        {/* Branches Presence with Hours */}
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8 space-y-2 relative">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Two Gurugram Locations
            </h2>
            <p className="text-xs text-gray-400">
              Open 10:00 AM – 10:00 PM (All 7 Days) for Takeaway, Dine-In, and Home Delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {branches.map((b) => (
              <div key={b.id} className="glass-card p-5 sm:p-6 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-base text-emerald-400 uppercase tracking-wide">
                    {b.name}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{b.openingHours || '10:00 AM – 10:00 PM (All 7 Days)'}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </p>
                <div className="pt-3 flex items-center justify-between text-xs border-t border-white/10">
                  <a href={`tel:+91${b.phone}`} className="text-white hover:text-emerald-400 font-bold flex items-center gap-1.5 interactive-press">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{b.phone}</span>
                  </a>
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 hover:underline font-bold interactive-press"
                  >
                    View Map Directions →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
