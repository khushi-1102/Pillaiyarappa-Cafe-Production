import React from 'react';
import { X, Phone, ExternalLink, Sparkles, MapPin, MessageCircle } from 'lucide-react';
import { SiteSettings, Branch } from '../../types';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  DEFAULT_WHATSAPP_MESSAGES,
  isMobileDevice,
} from '../../utils/whatsapp';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  branches?: Branch[];
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  settings,
  branches = [],
}) => {
  if (!isOpen) return null;

  // Branch-specific Zomato fallbacks matching verified links
  const southCityZomato =
    branches.find((b) => b.id === 'branch-1' || b.name.toLowerCase().includes('south city'))?.zomatoUrl ||
    'https://zomato.onelink.me/xqzv/gj35mxzd';

  const sec40Zomato =
    branches.find((b) => b.id === 'branch-2' || b.name.toLowerCase().includes('40'))?.zomatoUrl ||
    'https://zomato.onelink.me/xqzv/eexteimj';

  const hasSwiggy = settings.swiggyUrl && settings.swiggyUrl.trim().length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-modal-pop relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#131a15] via-[#0d120f] to-[#090c0a] p-5 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_-5px_rgba(22,139,79,0.35)] text-white border border-emerald-500/30 my-auto max-h-[92vh] overflow-y-auto overflow-x-hidden">
        {/* Ambient Top Emerald Radial Glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/25 blur-3xl rounded-full"
          aria-hidden="true"
        />

        {/* Modal Top Bar: Badge on left, Close button on right with clean separation */}
        <div className="relative flex items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-[0_0_12px_rgba(22,139,79,0.25)]">
            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">DIRECT IN-HOUSE DELIVERY (3 KM)</span>
          </div>

          {/* Dedicated Close Button with ample gap and micro-rotation */}
          <button
            onClick={onClose}
            className="interactive-press shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:rotate-90 transition-all duration-300 cursor-pointer shadow-xs active:scale-90"
            aria-label="Close order options"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Offer Subtitle */}
        <div className="pt-3 pb-2 text-left sm:text-center">
          <h2 id="order-modal-title" className="text-lg sm:text-2xl font-black font-display text-white tracking-tight">
            Order Online &amp; Home Delivery
          </h2>
          <p className="text-xs sm:text-sm text-emerald-400 font-bold mt-1 flex items-center sm:justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{settings.deliveryOfferText}</span>
          </p>
        </div>

        {/* Delivery platforms list */}
        <div className="mt-4 space-y-3.5">
          {/* Location-Wise Zomato Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <div className="w-4.5 h-4.5 rounded-full bg-[#E23744] text-white flex items-center justify-center shadow-xs px-0.5">
                  <svg className="w-3.5 h-auto fill-white" viewBox="0 8.5 24 7.5" role="img" aria-label="Zomato">
                    <path d="M19.615 9.45l-1.258.473-.167.71-.446.021-.115.978h.408l-.211 1.51c-.131.939.036 1.381.865 1.381.488 0 .91-.175 1.135-.297l.145-.9c-.167.083-.436.19-.618.19-.247 0-.276-.13-.225-.488l.189-1.396h.843c.03-.206.131-.877.16-1h-.865zm-3.779 1.002c-.115.002-.236.01-.361.026a3.592 3.592 0 0 0-1.347.432l.26.789c.269-.15.615-.28.978-.326.538-.066.757.1.79.375.014.109.004.199-.005.289l-.014.056a3.46 3.46 0 0 0-1.097-.036c-.518.063-.943.273-1.204.6a1.324 1.324 0 0 0-.225 1.034c.127.583.553.84 1.199.76.45-.055.812-.27 1.076-.63a2.665 2.665 0 0 1-.03.304 1.74 1.74 0 0 1-.072.29l1.244.001a3.657 3.657 0 0 1-.001-.365c.036-.459.118-1.143.247-2.051a2.397 2.397 0 0 0-.002-.59c-.08-.644-.628-.969-1.436-.958zm6.536.063c-1.194 0-2.107 1.067-2.107 2.342 0 .959.552 1.693 1.628 1.693 1.2 0 2.107-1.067 2.107-2.35 0-.95-.538-1.685-1.628-1.685zm-11.777.041c-.538 0-1.12.465-1.52 1.236.102-.504.08-1.076.051-1.198a8.964 8.964 0 0 1-1.287.122 6.9 6.9 0 0 1-.073 1.243l-.167 1.145c-.066.45-.138.969-.211 1.297h1.353c.007-.199.058-.511.094-.786l.116-.786c.095-.511.502-1.114.815-1.114.182 0 .175.176.124.504l-.131.885c-.066.45-.138.969-.211 1.297h1.367c.008-.199.051-.512.088-.786l.116-.786c.094-.512.502-1.114.814-1.114.182 0 .175.168.146.396l-.327 2.29H13l.438-2.609c.095-.649.044-1.236-.676-1.236-.523 0-1.09.443-1.49 1.182.087-.61.036-1.182-.677-1.182zm-4.88.008c-1.177 0-2.08 1.053-2.08 2.312 0 .946.546 1.67 1.608 1.67 1.185 0 2.08-1.052 2.08-2.319 0-.938-.531-1.663-1.607-1.663zm-5.126.091c-.05.39-.102.778-.175 1.13.328-.008.619-.016 1.411-.016l-1.81 1.96-.015.703c.444-.03.997-.039 1.63-.039.566 0 1.134.008 1.497.039.065-.458.13-.763.21-1.137-.275.015-.755.023-1.512.023l1.81-1.969.023-.694c-.437.023-.83.03-1.52.03-.749 0-.975-.007-1.549-.03zm4.988.927c.255 0 .408.228.408.701 0 .687-.276 1.251-.626 1.251-.261 0-.414-.236-.414-.702 0-.694.283-1.25.632-1.25zm16.629 0c.254 0 .407.228.407.701 0 .687-.276 1.251-.625 1.251-.262 0-.415-.236-.415-.702 0-.694.284-1.25.633-1.25zM15.51 12.64c.206-.003.403.024.55.058l-.013.118c-.075.44-.39.881-.848.938-.31.037-.578-.148-.608-.39a.538.538 0 0 1 .114-.41c.117-.159.336-.268.599-.3.069-.009.138-.013.206-.014Z" />
                  </svg>
                </div>
                <span>Order on Zomato (Choose Nearest Outlet):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: South City-1 */}
              <a
                href={southCityZomato}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-press flex flex-col justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#E23744]/80 hover:shadow-[0_8px_24px_-4px_rgba(226,55,68,0.35)] transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E23744] shrink-0" />
                    <p className="font-bold text-white text-sm group-hover:text-[#E23744] transition-colors">
                      South City-1
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition" />
                </div>
                <p className="text-[11px] text-gray-300 mt-1 line-clamp-1">Opp. Mayom Hospital, Sec 41</p>
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Fast Delivery</span>
                  <span className="text-xs font-bold text-[#E23744] group-hover:underline">Order Now →</span>
                </div>
              </a>

              {/* Option 2: Sector-40 */}
              <a
                href={sec40Zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-press flex flex-col justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#E23744]/80 hover:shadow-[0_8px_24px_-4px_rgba(226,55,68,0.35)] transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E23744] shrink-0" />
                    <p className="font-bold text-white text-sm group-hover:text-[#E23744] transition-colors">
                      Sector-40
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition" />
                </div>
                <p className="text-[11px] text-gray-300 mt-1 line-clamp-1">Main Huda Market, Gurugram</p>
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Fast Delivery</span>
                  <span className="text-xs font-bold text-[#E23744] group-hover:underline">Order Now →</span>
                </div>
              </a>
            </div>
          </div>

          {/* Swiggy (South City-1 Branch Only) */}
          {hasSwiggy && (
            <div className="pt-0.5">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1.5">
                Order on Swiggy (South City-1 Branch Only):
              </span>
              <a
                href={settings.swiggyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-press flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#FC8019]/30 hover:border-[#FC8019] hover:shadow-[0_8px_24px_-4px_rgba(252,128,25,0.3)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FC8019] flex items-center justify-center text-white shadow-[0_0_12px_rgba(252,128,25,0.4)] group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" role="img" aria-label="Swiggy">
                      <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm group-hover:text-[#FC8019] transition-colors">
                        Order on Swiggy
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FC8019]/20 text-[#FC8019] border border-[#FC8019]/30">
                        South City-1 Only
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300">Pillaiyarappa South Indian Corner | Huda City, Gurgaon</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </a>
            </div>
          )}

          {/* WhatsApp Direct Chat & Order */}
          <div className="pt-0.5">
            <a
              href={getSmartWhatsAppUrl(
                settings.whatsappNumber,
                DEFAULT_WHATSAPP_MESSAGES.order
              )}
              onClick={(e) =>
                handleWhatsAppLinkClick(
                  e,
                  settings.whatsappNumber,
                  DEFAULT_WHATSAPP_MESSAGES.order
                )
              }
              target={isMobileDevice() ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="interactive-press flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-black/40 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_8px_24px_rgba(22,139,79,0.3)] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#168B4F] flex items-center justify-center text-white shadow-[0_0_14px_rgba(22,139,79,0.5)] group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4.5 h-4.5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      Order / Chat on WhatsApp
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online Now
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300">Direct instant messaging (+91 9953919033)</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </a>
          </div>

          {/* Direct Phone Call Home Delivery */}
          <div className="pt-1">
            <p className="text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Direct Phone Call (Free Delivery on ₹500+ within 3 km Radius):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={`tel:+91${settings.phonePrimary}`}
                className="btn-shimmer interactive-press flex items-center justify-center gap-2 p-3 rounded-xl bg-[#168B4F] hover:bg-[#127742] text-white font-bold text-xs hover:shadow-[0_6px_20px_rgba(22,139,79,0.45)] transition border border-emerald-400/30"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Call {settings.phonePrimary}</span>
              </a>
              <a
                href={`tel:+91${settings.phoneSecondary}`}
                className="btn-shimmer interactive-press flex items-center justify-center gap-2 p-3 rounded-xl bg-[#168B4F] hover:bg-[#127742] text-white font-bold text-xs hover:shadow-[0_6px_20px_rgba(22,139,79,0.45)] transition border border-emerald-400/30"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Call {settings.phoneSecondary}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <p className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-gray-400">
          Pure Vegetarian Heritage • Freshly Prepared Daily • South City-1 &amp; Sector-40 Gurugram
        </p>
      </div>
    </div>
  );
};
