import React, { useState } from 'react';
import { Branch, SiteSettings } from '../types';
import { VineDivider } from '../components/brand/VineDivider';
import { MapPin, Phone, Clock, Navigation, ExternalLink, ShieldCheck, MessageCircle, CalendarDays, ArrowRight, Camera } from 'lucide-react';
import { getSmartWhatsAppUrl, handleWhatsAppLinkClick, isMobileDevice } from '../utils/whatsapp';
import { ReserveTableModal } from '../components/common/ReserveTableModal';
import { BranchGalleryCarousel } from '../components/common/BranchGalleryCarousel';

interface BranchesPageProps {
  branches: Branch[];
  settings: SiteSettings;
  onOpenOrderModal: () => void;
}

// Only the Sec-40 Huda Market branch has dine-in seating
const DINE_IN_BRANCH_SLUG = 'sec-40-huda-market';

export const BranchesPage: React.FC<BranchesPageProps> = ({
  branches,
  settings,
  onOpenOrderModal,
}) => {
  const [activeEmbedBranch, setActiveEmbedBranch] = useState<string | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveBranch, setReserveBranch] = useState<Branch | null>(null);

  const handleOpenReserve = (branch: Branch) => {
    setReserveBranch(branch);
    setIsReserveModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge">
              Gurugram, Haryana
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Our Branches
            </h1>
            <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
              Visit our two bustling South Indian corners in Gurugram for dine-in, takeaway, or fast home delivery.
            </p>
          </div>

          <VineDivider className="mb-10" />

          {/* Both Branches Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {branches.map((branch) => {
              const isMapOpen = activeEmbedBranch === branch.id;
              const hasDineIn = branch.slug === DINE_IN_BRANCH_SLUG;

              return (
                <div
                  key={branch.id}
                  className="rounded-3xl overflow-hidden glass-panel-elevated hover:border-emerald-500/50 transition-all duration-300 shadow-2xl flex flex-col justify-between group"
                >
                  {/* Storefront Image or Interactive Gallery Carousel */}
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
                        alt={`Pillaiyarappa ${branch.name} storefront in Gurugram`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4 glass-badge font-display font-black text-xs sm:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {branch.name}
                      </div>

                      {/* Dine-In Badge */}
                      {hasDineIn && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white font-display font-black text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          Dine-In Available
                        </div>
                      )}
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="space-y-2.5">
                      <h2 className="font-display font-black text-2xl text-white">
                        {branch.name} — Gurugram
                      </h2>
                      
                      <div className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed pt-1">
                        <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{branch.address}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-gray-400 pl-7">
                        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{branch.openingHours || '10:00 AM – 10:00 PM (Monday to Sunday)'}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-gray-400 pl-7">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{hasDineIn ? 'Dine-In • Takeaway • Free Delivery (Min ₹500 within 3 km)' : 'Takeaway • Free Delivery (Min ₹500 within 3 km)'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/10 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={`tel:+91${branch.phone}`}
                          className="btn-shimmer interactive-press flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition shadow-[0_4px_16px_rgba(22,139,79,0.3)]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call {branch.phone}</span>
                        </a>

                        <a
                          href={getSmartWhatsAppUrl(
                            settings.whatsappNumber,
                            `Hello Pillaiyarappa! I would like to order / inquire at ${branch.name} (${branch.address}).`
                          )}
                          onClick={(e) =>
                            handleWhatsAppLinkClick(
                              e,
                              settings.whatsappNumber,
                              `Hello Pillaiyarappa! I would like to order / inquire at ${branch.name} (${branch.address}).`
                            )
                          }
                          target={isMobileDevice() ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          className="interactive-press flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-[#168B4F] hover:bg-[#127742] text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(22,139,79,0.3)] transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-pill interactive-press flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 hover:text-emerald-300 transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Directions</span>
                        </a>

                        <button
                          onClick={() => setActiveEmbedBranch(isMapOpen ? null : branch.id)}
                          className="interactive-press py-2.5 px-3 rounded-xl glass-pill text-gray-300 hover:text-white text-xs font-semibold"
                        >
                          {isMapOpen ? 'Hide Map' : 'Show Map'}
                        </button>
                      </div>

                      {/* Reserve a Table Button — ONLY for Sec-40 dine-in branch */}
                      {hasDineIn && (
                        <button
                          type="button"
                          onClick={() => handleOpenReserve(branch)}
                          className="interactive-press w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)] transition-all group"
                        >
                          <CalendarDays className="w-4 h-4" />
                          <span>Reserve a Table at {branch.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}

                      {/* Direct Location-Wise Zomato Ordering Button */}
                      {branch.zomatoUrl && (
                        <a
                          href={branch.zomatoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive-press w-full py-3 px-4 rounded-xl bg-[#E23744] hover:bg-[#c92a36] text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(226,55,68,0.35)] hover:shadow-[0_6px_25px_rgba(226,55,68,0.5)] transition-all group"
                        >
                          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-display font-black text-xs">z</span>
                          <span>Order on Zomato ({branch.name} Outlet)</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      )}

                      {/* Direct Location-Wise Swiggy Ordering Button (South City-1 Only) */}
                      {branch.swiggyUrl && (
                        <a
                          href={branch.swiggyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="interactive-press w-full py-3 px-4 rounded-xl bg-[#FC8019] hover:bg-[#e06f12] text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(252,128,25,0.35)] hover:shadow-[0_6px_25px_rgba(252,128,25,0.5)] transition-all group"
                        >
                          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-display font-black text-xs">S</span>
                          <span>Order on Swiggy ({branch.name} Outlet)</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      )}
                    </div>

                    {/* Optional Lazy Map Embed */}
                    {isMapOpen && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 aspect-16/9 bg-neutral-900 shadow-xl">
                        <iframe
                          title={`${branch.name} Location Map`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            branch.address
                          )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Branch - 2 Dedicated Photo Tour & Gallery Showcase */}
          {(() => {
            const branch2 = branches.find((b) => b.id === 'branch-2' || b.slug === DINE_IN_BRANCH_SLUG);
            if (!branch2 || !branch2.gallery || branch2.gallery.length === 0) return null;

            return (
              <div className="mb-14 glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 relative">
                  <div>
                    <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider glass-badge text-emerald-300 mb-2">
                      Sector-40 HUDA Market Outlet
                    </span>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
                      <Camera className="w-6 h-6 text-emerald-400 shrink-0" />
                      <span>Branch - 2 Photo Gallery Mode</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                      Swipe left / right on mobile or use the big arrow buttons on desktop to tour our storefront, first-floor AC dine-in hall, and chef specials.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReserve(branch2)}
                    className="interactive-press shrink-0 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Reserve a Table</span>
                  </button>
                </div>

                {/* Big Carousel with Swipe & Navigation */}
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <BranchGalleryCarousel
                    gallery={branch2.gallery}
                    fallbackImage={branch2.image}
                    branchName="Branch - 2 (Sec-40)"
                    branchAddress={branch2.address}
                    hasDineIn={true}
                    aspectRatio="aspect-16/9 sm:aspect-21/9"
                    showThumbnails={true}
                  />
                </div>
              </div>
            );
          })()}

          {/* Delivery callout */}
          <div className="glass-panel-elevated rounded-3xl p-8 sm:p-10 text-center space-y-4 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight relative">
              Can't Visit In Person?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed relative">
              Order online with fast home delivery straight to your doorstep or office anywhere in Gurugram!
            </p>
            <div className="pt-2 relative">
              <button
                onClick={onOpenOrderModal}
                className="btn-shimmer interactive-press rounded-full bg-emerald-500 px-8 py-3.5 font-display font-black text-xs uppercase tracking-wider text-white hover:bg-emerald-400 transition shadow-[0_8px_28px_rgba(22,139,79,0.4)]"
              >
                Order on Zomato &amp; Swiggy
              </button>
            </div>
          </div>

        </div>
      </div>

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
          whatsappNumber={settings.whatsappNumber || '919953919033'}
        />
      )}
    </>
  );
};
