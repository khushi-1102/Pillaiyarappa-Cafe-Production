import React from 'react';
import { ChevronRight, Users, Phone, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../../types';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  DEFAULT_WHATSAPP_MESSAGES,
  isMobileDevice,
} from '../../utils/whatsapp';

interface ActionTilesProps {
  settings: SiteSettings;
  onOpenOrderModal: () => void;
  onNavigate: (path: string) => void;
}

export const ActionTiles: React.FC<ActionTilesProps> = ({
  settings,
  onOpenOrderModal,
  onNavigate,
}) => {
  const preloadedMsg = DEFAULT_WHATSAPP_MESSAGES.general;
  const whatsappHref = getSmartWhatsAppUrl(settings.whatsappNumber, preloadedMsg);

  return (
    <section className="py-4 sm:py-6 bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile View: Signature Call/WhatsApp Card from reference mockup + Catering */}
        <div className="sm:hidden space-y-3">
          {/* Signature Combined Call / WhatsApp Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 shrink-0">
                <a
                  href={`tel:+91${settings.phonePrimary}`}
                  className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_12px_rgba(22,139,79,0.4)] active:scale-95 transition z-10"
                  aria-label="Call primary contact"
                >
                  <Phone className="w-4 h-4 fill-current" />
                </a>
                <a
                  href={whatsappHref}
                  onClick={(e) => handleWhatsAppLinkClick(e, settings.whatsappNumber, preloadedMsg)}
                  target={isMobileDevice() ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#168B4F] text-white flex items-center justify-center shadow-[0_0_12px_rgba(22,139,79,0.4)] active:scale-95 transition"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
              </div>
              <div className="leading-tight">
                <span className="font-display font-extrabold text-white text-sm block">
                  Call / WhatsApp
                </span>
                <span className="font-semibold text-gray-300 text-xs block">
                  M. {settings.phonePrimary} / {settings.phoneSecondary}
                </span>
              </div>
            </div>

            <a
              href={`tel:+91${settings.phonePrimary}`}
              aria-label="Call now"
              className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 active:scale-90 transition shadow-[0_0_10px_rgba(22,139,79,0.3)]"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </a>
          </div>

          {/* Catering & Party Orders Card on Mobile */}
          <button
            onClick={() => onNavigate('/catering')}
            className="w-full text-left flex items-center justify-between p-4 rounded-2xl glass-card border border-white/10 shadow-lg active:scale-[0.99] transition"
            aria-label="Enquire about Catering Orders"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0 shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-gray-400 block uppercase font-medium">Party &amp; Events</span>
                <span className="font-display font-extrabold text-white text-sm">
                  Catering &amp; Bulk Orders
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(22,139,79,0.3)]">
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </div>
          </button>
        </div>

        {/* Desktop View: 4-Column Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Tile 1: Order on Zomato */}
          <button
            onClick={onOpenOrderModal}
            className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-[#E23744]/70 hover:shadow-[0_12px_30px_-5px_rgba(226,55,68,0.25)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-left"
            aria-label="Order food on Zomato (Choose Branch)"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E23744]/20 text-[#E23744] flex items-center justify-center border border-[#E23744]/30 shadow-xs group-hover:scale-110 transition-transform px-1">
                <svg className="w-7 h-auto fill-[#E23744]" viewBox="0 8.5 24 7.5" role="img" aria-label="Zomato">
                  <path d="M19.615 9.45l-1.258.473-.167.71-.446.021-.115.978h.408l-.211 1.51c-.131.939.036 1.381.865 1.381.488 0 .91-.175 1.135-.297l.145-.9c-.167.083-.436.19-.618.19-.247 0-.276-.13-.225-.488l.189-1.396h.843c.03-.206.131-.877.16-1h-.865zm-3.779 1.002c-.115.002-.236.01-.361.026a3.592 3.592 0 0 0-1.347.432l.26.789c.269-.15.615-.28.978-.326.538-.066.757.1.79.375.014.109.004.199-.005.289l-.014.056a3.46 3.46 0 0 0-1.097-.036c-.518.063-.943.273-1.204.6a1.324 1.324 0 0 0-.225 1.034c.127.583.553.84 1.199.76.45-.055.812-.27 1.076-.63a2.665 2.665 0 0 1-.03.304 1.74 1.74 0 0 1-.072.29l1.244.001a3.657 3.657 0 0 1-.001-.365c.036-.459.118-1.143.247-2.051a2.397 2.397 0 0 0-.002-.59c-.08-.644-.628-.969-1.436-.958zm6.536.063c-1.194 0-2.107 1.067-2.107 2.342 0 .959.552 1.693 1.628 1.693 1.2 0 2.107-1.067 2.107-2.35 0-.95-.538-1.685-1.628-1.685zm-11.777.041c-.538 0-1.12.465-1.52 1.236.102-.504.08-1.076.051-1.198a8.964 8.964 0 0 1-1.287.122 6.9 6.9 0 0 1-.073 1.243l-.167 1.145c-.066.45-.138.969-.211 1.297h1.353c.007-.199.058-.511.094-.786l.116-.786c.095-.511.502-1.114.815-1.114.182 0 .175.176.124.504l-.131.885c-.066.45-.138.969-.211 1.297h1.367c.008-.199.051-.512.088-.786l.116-.786c.094-.512.502-1.114.814-1.114.182 0 .175.168.146.396l-.327 2.29H13l.438-2.609c.095-.649.044-1.236-.676-1.236-.523 0-1.09.443-1.49 1.182.087-.61.036-1.182-.677-1.182zm-4.88.008c-1.177 0-2.08 1.053-2.08 2.312 0 .946.546 1.67 1.608 1.67 1.185 0 2.08-1.052 2.08-2.319 0-.938-.531-1.663-1.607-1.663zm-5.126.091c-.05.39-.102.778-.175 1.13.328-.008.619-.016 1.411-.016l-1.81 1.96-.015.703c.444-.03.997-.039 1.63-.039.566 0 1.134.008 1.497.039.065-.458.13-.763.21-1.137-.275.015-.755.023-1.512.023l1.81-1.969.023-.694c-.437.023-.83.03-1.52.03-.749 0-.975-.007-1.549-.03zm4.988.927c.255 0 .408.228.408.701 0 .687-.276 1.251-.626 1.251-.261 0-.414-.236-.414-.702 0-.694.283-1.25.632-1.25zm16.629 0c.254 0 .407.228.407.701 0 .687-.276 1.251-.625 1.251-.262 0-.415-.236-.415-.702 0-.694.284-1.25.633-1.25zM15.51 12.64c.206-.003.403.024.55.058l-.013.118c-.075.44-.39.881-.848.938-.31.037-.578-.148-.608-.39a.538.538 0 0 1 .114-.41c.117-.159.336-.268.599-.3.069-.009.138-.013.206-.014Z" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="text-[11px] text-gray-400 block uppercase font-medium">Delivery</span>
                <span className="font-display font-black text-white text-base tracking-wide group-hover:text-[#E23744] transition-colors">
                  Order on zomato
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-115 group-hover:translate-x-0.5 transition-all shadow-[0_0_10px_rgba(22,139,79,0.3)]">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>

          {/* Tile 2: Order on Swiggy */}
          <a
            href={settings.swiggyUrl || '#'}
            onClick={(e) => {
              if (!settings.swiggyUrl) {
                e.preventDefault();
                onOpenOrderModal();
              }
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-[#FC8019]/70 hover:shadow-[0_12px_30px_-5px_rgba(252,128,25,0.25)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Order food on Swiggy"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FC8019]/20 text-[#FC8019] flex items-center justify-center border border-[#FC8019]/30 shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 fill-[#FC8019]" viewBox="0 0 24 24" role="img" aria-label="Swiggy">
                  <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="text-[11px] text-gray-400 block uppercase font-medium">Delivery</span>
                <span className="font-display font-black text-white text-base tracking-wide group-hover:text-[#FC8019] transition-colors">
                  Order on SWIGGY
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-115 group-hover:translate-x-0.5 transition-all shadow-[0_0_10px_rgba(22,139,79,0.3)]">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </a>

          {/* Tile 3: Contact for Catering Orders */}
          <button
            onClick={() => onNavigate('/catering')}
            className="group text-left flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-emerald-500/70 hover:shadow-[0_12px_30px_-5px_rgba(22,139,79,0.3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            aria-label="Enquire about Party and Catering Orders"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-xs group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="text-[11px] text-gray-400 block uppercase font-medium">Party &amp; Events</span>
                <span className="font-display font-black text-white text-sm sm:text-base tracking-wide group-hover:text-emerald-400 transition-colors">
                  Catering Orders
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-115 group-hover:translate-x-0.5 transition-all shadow-[0_0_10px_rgba(22,139,79,0.3)]">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>

          {/* Tile 4: Call / WhatsApp M. 9899101195 / 9953919033 */}
          <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-emerald-500/70 hover:shadow-[0_12px_30px_-5px_rgba(22,139,79,0.25)] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <a
                  href={`tel:+91${settings.phonePrimary}`}
                  className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs hover:scale-115 transition"
                  title="Call Primary Phone"
                  aria-label="Call primary contact number"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                </a>
                <a
                  href={whatsappHref}
                  onClick={(e) => handleWhatsAppLinkClick(e, settings.whatsappNumber, preloadedMsg)}
                  target={isMobileDevice() ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs hover:scale-115 transition"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                </a>
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-gray-400 block uppercase font-medium">Direct Line</span>
                <span className="font-bold text-white text-xs block truncate max-w-[150px] sm:max-w-[130px]">
                  M. {settings.phonePrimary} / {settings.phoneSecondary}
                </span>
              </div>
            </div>
            <a
              href={`tel:+91${settings.phonePrimary}`}
              aria-label="Call Pillaiyarappa"
              className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 hover:scale-115 transition-transform shadow-[0_0_10px_rgba(22,139,79,0.3)]"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
