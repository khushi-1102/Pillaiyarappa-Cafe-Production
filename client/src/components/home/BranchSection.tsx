import React, { useState, useEffect } from 'react';
import { Branch, SiteSettings } from '../../types';
import { MapPin, ChevronDown, ArrowRight, Phone, Navigation, CalendarDays } from 'lucide-react';
import { ReserveTableModal } from '../common/ReserveTableModal';
import { triggerHaptic } from '../../utils/haptics';
import { BranchGalleryCarousel } from '../common/BranchGalleryCarousel';

interface BranchSectionProps {
  branches: Branch[];
  onNavigateToBranches?: () => void;
  settings?: SiteSettings;
}

// Only the Sec-40 Huda Market branch has dine-in seating
const DINE_IN_BRANCH_SLUG = 'sec-40-huda-market';

export const BranchSection: React.FC<BranchSectionProps> = ({
  branches,
  onNavigateToBranches,
  settings,
}) => {
  // Allow multiple branches to stay open simultaneously on phone view (both open by default)
  const [expandedMobileBranches, setExpandedMobileBranches] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    branches.forEach((b) => {
      initial[b.id] = true;
    });
    return initial;
  });

  // Ensure all branches default to open when loaded
  useEffect(() => {
    setExpandedMobileBranches((prev) => {
      const next = { ...prev };
      branches.forEach((b) => {
        if (next[b.id] === undefined) {
          next[b.id] = true;
        }
      });
      return next;
    });
  }, [branches]);

  const toggleMobileBranch = (id: string) => {
    triggerHaptic('light');
    setExpandedMobileBranches((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveBranch, setReserveBranch] = useState<Branch | null>(null);

  const handleOpenReserve = (branch: Branch) => {
    setReserveBranch(branch);
    setIsReserveModalOpen(true);
  };

  return (
    <>
      <section className="py-8 sm:py-12 bg-[#090909]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title: Our Branches —— */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Our Branches
              </h2>
              <div className="h-1.5 w-12 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-[0_0_10px_rgba(22,139,79,0.5)]" aria-hidden="true" />
            </div>

            {onNavigateToBranches && (
              <button
                onClick={onNavigateToBranches}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
              >
                <span>All Branch Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop View: Two Branch Cards with Storefront Photos */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-6">
            {branches.map((branch) => {
              const hasDineIn = branch.slug === DINE_IN_BRANCH_SLUG;

              return (
                <div
                  key={branch.id}
                  className="rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-emerald-500/70 hover:shadow-[0_20px_45px_-10px_rgba(22,139,79,0.3)] transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Branch Storefront Image or Gallery Carousel */}
                  {branch.gallery && branch.gallery.length > 0 ? (
                    <BranchGalleryCarousel
                      gallery={branch.gallery}
                      fallbackImage={branch.image}
                      branchName={branch.name}
                      branchAddress={branch.address}
                      hasDineIn={hasDineIn}
                      aspectRatio="aspect-16/9"
                    />
                  ) : (
                    <div className="relative aspect-16/9 overflow-hidden bg-neutral-900">
                      <img
                        src={branch.image}
                        alt={`Pillaiyarappa ${branch.name} storefront`}
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Branch Badge with Glow */}
                      <div className="absolute top-3.5 left-3.5 bg-emerald-500 text-white font-display font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(22,139,79,0.6)]">
                        {branch.name}
                      </div>

                      {/* Dine-In Badge */}
                      {hasDineIn && (
                        <div className="absolute top-3.5 right-3.5 bg-amber-500 text-white font-display font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          Dine-In
                        </div>
                      )}
                    </div>
                  )}

                  {/* Branch Info & Outlined Emerald Pill Button */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg text-white">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{branch.address}</span>
                      </p>
                      <p className="text-xs text-gray-400 pl-6">
                        {branch.openingHours || '10:00 AM – 10:00 PM (All 7 Days)'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <a
                          href={`tel:+91${branch.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs text-white hover:text-emerald-400 font-semibold transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{branch.phone}</span>
                        </a>

                        {/* Outlined Emerald Pill: View on Map → */}
                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-xs group/btn"
                        >
                          <span>View on Map</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </div>

                      {/* Reserve a Table Button — ONLY for Sec-40 dine-in branch */}
                      {hasDineIn && (
                        <button
                          type="button"
                          onClick={() => handleOpenReserve(branch)}
                          className="interactive-press w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_22px_rgba(245,158,11,0.45)] transition-all group"
                        >
                          <CalendarDays className="w-4 h-4" />
                          <span>Reserve a Table</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}

                      {/* Direct Location-Wise Zomato Ordering Link */}
                      {branch.zomatoUrl && (
                        <a
                          href={branch.zomatoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive-press w-full py-2.5 px-3 rounded-xl bg-[#E23744] hover:bg-[#c92a36] text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(226,55,68,0.3)] hover:shadow-[0_6px_22px_rgba(226,55,68,0.45)] transition-all group"
                        >
                          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center px-0.5">
                            <svg className="w-3.5 h-auto fill-white" viewBox="0 8.5 24 7.5" role="img" aria-label="Zomato">
                              <path d="M19.615 9.45l-1.258.473-.167.71-.446.021-.115.978h.408l-.211 1.51c-.131.939.036 1.381.865 1.381.488 0 .91-.175 1.135-.297l.145-.9c-.167.083-.436.19-.618.19-.247 0-.276-.13-.225-.488l.189-1.396h.843c.03-.206.131-.877.16-1h-.865zm-3.779 1.002c-.115.002-.236.01-.361.026a3.592 3.592 0 0 0-1.347.432l.26.789c.269-.15.615-.28.978-.326.538-.066.757.1.79.375.014.109.004.199-.005.289l-.014.056a3.46 3.46 0 0 0-1.097-.036c-.518.063-.943.273-1.204.6a1.324 1.324 0 0 0-.225 1.034c.127.583.553.84 1.199.76.45-.055.812-.27 1.076-.63a2.665 2.665 0 0 1-.03.304 1.74 1.74 0 0 1-.072.29l1.244.001a3.657 3.657 0 0 1-.001-.365c.036-.459.118-1.143.247-2.051a2.397 2.397 0 0 0-.002-.59c-.08-.644-.628-.969-1.436-.958zm6.536.063c-1.194 0-2.107 1.067-2.107 2.342 0 .959.552 1.693 1.628 1.693 1.2 0 2.107-1.067 2.107-2.35 0-.95-.538-1.685-1.628-1.685zm-11.777.041c-.538 0-1.12.465-1.52 1.236.102-.504.08-1.076.051-1.198a8.964 8.964 0 0 1-1.287.122 6.9 6.9 0 0 1-.073 1.243l-.167 1.145c-.066.45-.138.969-.211 1.297h1.353c.007-.199.058-.511.094-.786l.116-.786c.095-.511.502-1.114.815-1.114.182 0 .175.176.124.504l-.131.885c-.066.45-.138.969-.211 1.297h1.367c.008-.199.051-.512.088-.786l.116-.786c.094-.512.502-1.114.814-1.114.182 0 .175.168.146.396l-.327 2.29H13l.438-2.609c.095-.649.044-1.236-.676-1.236-.523 0-1.09.443-1.49 1.182.087-.61.036-1.182-.677-1.182zm-4.88.008c-1.177 0-2.08 1.053-2.08 2.312 0 .946.546 1.67 1.608 1.67 1.185 0 2.08-1.052 2.08-2.319 0-.938-.531-1.663-1.607-1.663zm-5.126.091c-.05.39-.102.778-.175 1.13.328-.008.619-.016 1.411-.016l-1.81 1.96-.015.703c.444-.03.997-.039 1.63-.039.566 0 1.134.008 1.497.039.065-.458.13-.763.21-1.137-.275.015-.755.023-1.512.023l1.81-1.969.023-.694c-.437.023-.83.03-1.52.03-.749 0-.975-.007-1.549-.03zm4.988.927c.255 0 .408.228.408.701 0 .687-.276 1.251-.626 1.251-.261 0-.414-.236-.414-.702 0-.694.283-1.25.632-1.25zm16.629 0c.254 0 .407.228.407.701 0 .687-.276 1.251-.625 1.251-.262 0-.415-.236-.415-.702 0-.694.284-1.25.633-1.25zM15.51 12.64c.206-.003.403.024.55.058l-.013.118c-.075.44-.39.881-.848.938-.31.037-.578-.148-.608-.39a.538.538 0 0 1 .114-.41c.117-.159.336-.268.599-.3.069-.009.138-.013.206-.014Z" />
                            </svg>
                          </div>
                          <span>Order on Zomato ({branch.name})</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}

                      {/* Direct Swiggy Ordering Link (South City-1 Only) */}
                      {branch.swiggyUrl && (
                        <a
                          href={branch.swiggyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive-press w-full py-2.5 px-3 rounded-xl bg-[#FC8019] hover:bg-[#e06f12] text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(252,128,25,0.3)] hover:shadow-[0_6px_22px_rgba(252,128,25,0.45)] transition-all group"
                        >
                          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24" role="img" aria-label="Swiggy">
                              <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z" />
                            </svg>
                          </div>
                          <span>Order on Swiggy ({branch.name})</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile View: Smooth Multi-Expand Accordion Rows (Both branches open together by default) */}
          <div className="sm:hidden space-y-3">
            {branches.map((branch) => {
              const isExpanded = !!expandedMobileBranches[branch.id];
              const hasDineIn = branch.slug === DINE_IN_BRANCH_SLUG;

              return (
                <div
                  key={branch.id}
                  className={`rounded-2xl overflow-hidden glass-card transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md ${
                    isExpanded
                      ? 'border-emerald-500/50 shadow-[0_8px_30px_rgba(22,139,79,0.22)]'
                      : 'border border-white/10'
                  }`}
                >
                  {/* Header row with Emerald Pin & Smooth Rotating Chevron */}
                  <button
                    type="button"
                    onClick={() => toggleMobileBranch(branch.id)}
                    className="w-full p-4 flex items-center justify-between text-left outline-none focus:outline-none active:bg-white/[0.03] transition-colors duration-200 cursor-pointer select-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(22,139,79,0.4)] transition-transform duration-300">
                        <MapPin className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display font-bold text-sm text-white">{branch.name}</p>
                          {hasDineIn && (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase">Dine-In</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-1">{branch.address}</p>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isExpanded ? 'rotate-180 text-emerald-400' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Silky-Smooth Animated Grid Accordion with Smooth Opacity & Slide */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className={`px-4 pb-4 pt-2 border-t border-white/10 space-y-3 text-xs transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isExpanded ? 'translate-y-0' : '-translate-y-2'
                      }`}>
                        {/* Mobile Swipeable Gallery with Big Buttons & Touch Swipe */}
                        {branch.gallery && branch.gallery.length > 0 && (
                          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg -mx-1 mb-3">
                            <BranchGalleryCarousel
                              gallery={branch.gallery}
                              fallbackImage={branch.image}
                              branchName={branch.name}
                              branchAddress={branch.address}
                              hasDineIn={hasDineIn}
                              aspectRatio="aspect-16/9"
                              showThumbnails={true}
                            />
                          </div>
                        )}

                        <p className="text-gray-300 leading-relaxed">{branch.address}</p>
                        <p className="text-gray-400">{branch.openingHours || 'Open 10:00 AM – 10:00 PM'}</p>
                        
                        <div className="flex items-center gap-2 pt-2">
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-pill interactive-press flex-1 py-2.5 px-3 rounded-full text-emerald-400 font-bold text-center flex items-center justify-center gap-1.5 hover:text-white transition"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>View on Map</span>
                          </a>
                          <a
                            href={`tel:+91${branch.phone}`}
                            className="btn-shimmer interactive-press py-2.5 px-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition shadow-[0_4px_14px_rgba(22,139,79,0.35)]"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        </div>

                        {/* Reserve a Table Button — ONLY for Sec-40 dine-in branch (Mobile) */}
                        {hasDineIn && (
                          <button
                            type="button"
                            onClick={() => handleOpenReserve(branch)}
                            className="interactive-press w-full py-2.5 px-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(245,158,11,0.35)] transition"
                          >
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>Reserve a Table</span>
                          </button>
                        )}

                        {/* Location-wise Zomato Order Button on Mobile Accordion with Real Logo */}
                        {branch.zomatoUrl && (
                          <a
                            href={branch.zomatoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="interactive-press w-full py-2.5 px-3 rounded-full bg-[#E23744] hover:bg-[#c92a36] text-white font-bold text-center flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(226,55,68,0.35)] transition"
                          >
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center px-0.5">
                              <svg className="w-4 h-auto fill-white" viewBox="0 8.5 24 7.5" role="img" aria-label="Zomato">
                                <path d="M19.615 9.45l-1.258.473-.167.71-.446.021-.115.978h.408l-.211 1.51c-.131.939.036 1.381.865 1.381.488 0 .91-.175 1.135-.297l.145-.9c-.167.083-.436.19-.618.19-.247 0-.276-.13-.225-.488l.189-1.396h.843c.03-.206.131-.877.16-1h-.865zm-3.779 1.002c-.115.002-.236.01-.361.026a3.592 3.592 0 0 0-1.347.432l.26.789c.269-.15.615-.28.978-.326.538-.066.757.1.79.375.014.109.004.199-.005.289l-.014.056a3.46 3.46 0 0 0-1.097-.036c-.518.063-.943.273-1.204.6a1.324 1.324 0 0 0-.225 1.034c.127.583.553.84 1.199.76.45-.055.812-.27 1.076-.63a2.665 2.665 0 0 1-.03.304 1.74 1.74 0 0 1-.072.29l1.244.001a3.657 3.657 0 0 1-.001-.365c.036-.459.118-1.143.247-2.051a2.397 2.397 0 0 0-.002-.59c-.08-.644-.628-.969-1.436-.958zm6.536.063c-1.194 0-2.107 1.067-2.107 2.342 0 .959.552 1.693 1.628 1.693 1.2 0 2.107-1.067 2.107-2.35 0-.95-.538-1.685-1.628-1.685zm-11.777.041c-.538 0-1.12.465-1.52 1.236.102-.504.08-1.076.051-1.198a8.964 8.964 0 0 1-1.287.122 6.9 6.9 0 0 1-.073 1.243l-.167 1.145c-.066.45-.138.969-.211 1.297h1.353c.007-.199.058-.511.094-.786l.116-.786c.095-.511.502-1.114.815-1.114.182 0 .175.176.124.504l-.131.885c-.066.45-.138.969-.211 1.297h1.367c.008-.199.051-.512.088-.786l.116-.786c.094-.512.502-1.114.814-1.114.182 0 .175.168.146.396l-.327 2.29H13l.438-2.609c.095-.649.044-1.236-.676-1.236-.523 0-1.09.443-1.49 1.182.087-.61.036-1.182-.677-1.182zm-4.88.008c-1.177 0-2.08 1.053-2.08 2.312 0 .946.546 1.67 1.608 1.67 1.185 0 2.08-1.052 2.08-2.319 0-.938-.531-1.663-1.607-1.663zm-5.126.091c-.05.39-.102.778-.175 1.13.328-.008.619-.016 1.411-.016l-1.81 1.96-.015.703c.444-.03.997-.039 1.63-.039.566 0 1.134.008 1.497.039.065-.458.13-.763.21-1.137-.275.015-.755.023-1.512.023l1.81-1.969.023-.694c-.437.023-.83.03-1.52.03-.749 0-.975-.007-1.549-.03zm4.988.927c.255 0 .408.228.408.701 0 .687-.276 1.251-.626 1.251-.261 0-.414-.236-.414-.702 0-.694.283-1.25.632-1.25zm16.629 0c.254 0 .407.228.407.701 0 .687-.276 1.251-.625 1.251-.262 0-.415-.236-.415-.702 0-.694.284-1.25.633-1.25zM15.51 12.64c.206-.003.403.024.55.058l-.013.118c-.075.44-.39.881-.848.938-.31.037-.578-.148-.608-.39a.538.538 0 0 1 .114-.41c.117-.159.336-.268.599-.3.069-.009.138-.013.206-.014Z" />
                              </svg>
                            </div>
                            <span>Order on Zomato ({branch.name})</span>
                          </a>
                        )}

                        {/* Location-wise Swiggy Order Button on Mobile Accordion with Real Logo */}
                        {branch.swiggyUrl && (
                          <a
                            href={branch.swiggyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="interactive-press w-full py-2.5 px-3 rounded-full bg-[#FC8019] hover:bg-[#e06f12] text-white font-bold text-center flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(252,128,25,0.35)] transition"
                          >
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24" role="img" aria-label="Swiggy">
                                <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z" />
                              </svg>
                            </div>
                            <span>Order on Swiggy ({branch.name})</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Reserve Table Modal */}
      {reserveBranch && (
        <ReserveTableModal
          isOpen={isReserveModalOpen}
          onClose={() => {
            setIsReserveModalOpen(false);
            setReserveBranch(null);
          }}
          branchName={reserveBranch.name}
          branchAddress={reserveBranch.address}
          branchId={reserveBranch.id}
          branchSlug={reserveBranch.slug}
          whatsappNumber={settings?.whatsappNumber || '919953919033'}
        />
      )}
    </>
  );
};
