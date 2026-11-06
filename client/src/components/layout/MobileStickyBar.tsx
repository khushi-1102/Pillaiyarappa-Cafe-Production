import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../../types';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  getPageWhatsAppMessage,
  isMobileDevice,
} from '../../utils/whatsapp';

interface MobileStickyBarProps {
  settings: SiteSettings;
  currentPath: string;
  onOpenOrderModal: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  settings,
  currentPath,
  onOpenOrderModal,
}) => {
  // Hide on admin portal
  if (currentPath.startsWith('/admin')) return null;

  // Dynamically select contextual message per page (e.g. Catering message when on /catering)
  const preloadedMsg = getPageWhatsAppMessage(currentPath);
  const whatsappHref = getSmartWhatsAppUrl(settings.whatsappNumber, preloadedMsg);

  return (
    <nav
      aria-label="Mobile Quick Actions"
      className="animate-dock-up sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-2xl border-t border-white/10 px-3 pt-2 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-16px_40px_rgba(0,0,0,0.95)] touch-manipulation"
    >
      {/* 1. Call: Real Phone Dialer */}
      <a
        href={`tel:+91${settings.phonePrimary}`}
        aria-label="Call Pillaiyarappa Restaurant"
        className="interactive-press flex flex-col items-center justify-center p-1 text-white hover:text-emerald-400 min-w-[62px] group select-none"
      >
        <div className="w-10 h-10 rounded-full bg-[#168B4F] text-white flex items-center justify-center shadow-[0_0_16px_rgba(22,139,79,0.5)] group-hover:scale-105 active:scale-90 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24" role="img" aria-label="Phone Call">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 3.99c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.61c0-.55-.45-1-.99-1.01z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold mt-1 text-gray-200 group-hover:text-emerald-400 transition-colors">Call</span>
      </a>

      {/* 2. WhatsApp: Official Real WhatsApp Logo */}
      <a
        href={whatsappHref}
        onClick={(e) => handleWhatsAppLinkClick(e, settings.whatsappNumber, preloadedMsg)}
        target={isMobileDevice() ? '_self' : '_blank'}
        rel="noopener noreferrer"
        aria-label="Chat with Pillaiyarappa on WhatsApp"
        className="interactive-press flex flex-col items-center justify-center p-1 text-white hover:text-[#25D366] min-w-[62px] group select-none"
      >
        <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_16px_rgba(37,211,102,0.45)] group-hover:scale-105 active:scale-90 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" role="img" aria-label="WhatsApp">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
        <span className="text-[10px] font-bold mt-1 text-gray-200 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
      </a>

      {/* 3. Zomato: Official Real Zomato Wordmark Logo */}
      <button
        onClick={onOpenOrderModal}
        aria-label="Order on Zomato (Choose Branch)"
        className="interactive-press flex flex-col items-center justify-center p-1 text-white hover:text-[#E23744] min-w-[62px] group cursor-pointer select-none"
      >
        <div className="w-10 h-10 rounded-full bg-[#E23744] text-white flex items-center justify-center shadow-[0_0_16px_rgba(226,55,68,0.45)] group-hover:scale-105 active:scale-90 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] px-1">
          <svg className="w-8 h-auto fill-white" viewBox="0 8.5 24 7.5" role="img" aria-label="Zomato">
            <path d="M19.615 9.45l-1.258.473-.167.71-.446.021-.115.978h.408l-.211 1.51c-.131.939.036 1.381.865 1.381.488 0 .91-.175 1.135-.297l.145-.9c-.167.083-.436.19-.618.19-.247 0-.276-.13-.225-.488l.189-1.396h.843c.03-.206.131-.877.16-1h-.865zm-3.779 1.002c-.115.002-.236.01-.361.026a3.592 3.592 0 0 0-1.347.432l.26.789c.269-.15.615-.28.978-.326.538-.066.757.1.79.375.014.109.004.199-.005.289l-.014.056a3.46 3.46 0 0 0-1.097-.036c-.518.063-.943.273-1.204.6a1.324 1.324 0 0 0-.225 1.034c.127.583.553.84 1.199.76.45-.055.812-.27 1.076-.63a2.665 2.665 0 0 1-.03.304 1.74 1.74 0 0 1-.072.29l1.244.001a3.657 3.657 0 0 1-.001-.365c.036-.459.118-1.143.247-2.051a2.397 2.397 0 0 0-.002-.59c-.08-.644-.628-.969-1.436-.958zm6.536.063c-1.194 0-2.107 1.067-2.107 2.342 0 .959.552 1.693 1.628 1.693 1.2 0 2.107-1.067 2.107-2.35 0-.95-.538-1.685-1.628-1.685zm-11.777.041c-.538 0-1.12.465-1.52 1.236.102-.504.08-1.076.051-1.198a8.964 8.964 0 0 1-1.287.122 6.9 6.9 0 0 1-.073 1.243l-.167 1.145c-.066.45-.138.969-.211 1.297h1.353c.007-.199.058-.511.094-.786l.116-.786c.095-.511.502-1.114.815-1.114.182 0 .175.176.124.504l-.131.885c-.066.45-.138.969-.211 1.297h1.367c.008-.199.051-.512.088-.786l.116-.786c.094-.512.502-1.114.814-1.114.182 0 .175.168.146.396l-.327 2.29H13l.438-2.609c.095-.649.044-1.236-.676-1.236-.523 0-1.09.443-1.49 1.182.087-.61.036-1.182-.677-1.182zm-4.88.008c-1.177 0-2.08 1.053-2.08 2.312 0 .946.546 1.67 1.608 1.67 1.185 0 2.08-1.052 2.08-2.319 0-.938-.531-1.663-1.607-1.663zm-5.126.091c-.05.39-.102.778-.175 1.13.328-.008.619-.016 1.411-.016l-1.81 1.96-.015.703c.444-.03.997-.039 1.63-.039.566 0 1.134.008 1.497.039.065-.458.13-.763.21-1.137-.275.015-.755.023-1.512.023l1.81-1.969.023-.694c-.437.023-.83.03-1.52.03-.749 0-.975-.007-1.549-.03zm4.988.927c.255 0 .408.228.408.701 0 .687-.276 1.251-.626 1.251-.261 0-.414-.236-.414-.702 0-.694.283-1.25.632-1.25zm16.629 0c.254 0 .407.228.407.701 0 .687-.276 1.251-.625 1.251-.262 0-.415-.236-.415-.702 0-.694.284-1.25.633-1.25zM15.51 12.64c.206-.003.403.024.55.058l-.013.118c-.075.44-.39.881-.848.938-.31.037-.578-.148-.608-.39a.538.538 0 0 1 .114-.41c.117-.159.336-.268.599-.3.069-.009.138-.013.206-.014Z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold mt-1 text-gray-200 group-hover:text-[#E23744] transition-colors">Zomato</span>
      </button>

      {/* 4. Swiggy: Official Real Swiggy Emblem Logo */}
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
        aria-label="Order on Swiggy"
        className="interactive-press flex flex-col items-center justify-center p-1 text-white hover:text-[#FC8019] min-w-[62px] group select-none"
      >
        <div className="w-10 h-10 rounded-full bg-[#FC8019] text-white flex items-center justify-center shadow-[0_0_16px_rgba(252,128,25,0.45)] group-hover:scale-105 active:scale-90 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" role="img" aria-label="Swiggy">
            <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold mt-1 text-gray-200 group-hover:text-[#FC8019] transition-colors">Swiggy</span>
      </a>
    </nav>
  );
};
