import React, { useState, useEffect } from 'react';
import { LogoLockup } from '../brand/LogoLockup';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { Phone, Menu, X, ChevronRight, Sparkles, ShoppingBag, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../../types';
import { useCart } from '../../hooks/useCart';
import { triggerHaptic } from '../../utils/haptics';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  getPageWhatsAppMessage,
  isMobileDevice,
} from '../../utils/whatsapp';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings: SiteSettings;
  onOpenOrderModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  settings,
  onOpenOrderModal,
}) => {
  const { totalCount, totalAmount, openCartDrawer } = useCart();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Menu', path: '/menu' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Branches', path: '/branches' },
    { label: 'Contact', path: '/contact' },
  ];

  const announcementItems = [
    {
      badge: 'ESTD. 2014',
      text: 'Serving Gurugram Since 2014 • 12+ Years of Authentic South Indian Taste • Open 10:00 AM – 10:00 PM Daily',
      icon: Sparkles,
      badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
    },
    {
      badge: 'SPECIAL ANNOUNCEMENT',
      text: settings.announcementText || 'Special Festival Catering Available! Call 9899101195 for customized party menus.',
      icon: Sparkles,
      badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
    },
    {
      badge: 'FREE DELIVERY',
      text: settings.deliveryOfferText || 'Free Home Delivery — Minimum Order = ₹500/- across Gurugram',
      icon: ShoppingBag,
      badgeColor: 'bg-amber-500/25 text-amber-300 border-amber-400/40',
    },
    {
      badge: '100% PURE VEG',
      text: 'Authentic South Indian Heritage • Crispy Dosas, Idlis, Vadas & Filter Coffee (10:00 AM – 10:00 PM)',
      icon: Sparkles,
      badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
    },
    {
      badge: '2 OUTLETS GURUGRAM',
      text: 'South City-1 (Swiggy & Zomato) • Sector-40 Huda Market (Dine-In Seating & Zomato)',
      icon: Phone,
      badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
    },
  ];

  return (
    <>
      {/* Top Dynamic Moving Announcement & Offer Banner (Laptop & Mobile) */}
      {settings.announcementActive && (
        <aside
          aria-label="Promotional announcements and current restaurant offers"
          className="relative bg-gradient-to-r from-[#03150b] via-[#06331a] to-[#03150b] text-emerald-200 border-b border-emerald-500/30 text-[11px] sm:text-xs font-semibold py-2 overflow-hidden select-none shadow-[0_2px_15px_rgba(22,139,79,0.25)] z-40"
        >
          {/* Edge gradient fade masks */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#03150b] to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#03150b] to-transparent z-10"
            aria-hidden="true"
          />

          {/* Infinite Marquee Track with Pause-on-Hover */}
          <div className="animate-marquee items-center gap-6 sm:gap-10">
            {/* First Set of Items */}
            <div className="flex items-center gap-6 sm:gap-10 shrink-0">
              {announcementItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={`banner-a-${index}`} className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border shadow-xs ${item.badgeColor}`}
                    >
                      <IconComponent className="w-2.5 h-2.5 shrink-0" />
                      <span>{item.badge}</span>
                    </span>
                    <span className="text-white font-medium tracking-wide">
                      {item.text}
                    </span>
                    <span className="text-emerald-400/60 pl-4 sm:pl-6 select-none" aria-hidden="true">
                      ✦
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cloned Set of Items for Seamless Infinite Loop */}
            <div className="flex items-center gap-6 sm:gap-10 shrink-0" aria-hidden="true">
              {announcementItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={`banner-b-${index}`} className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border shadow-xs ${item.badgeColor}`}
                    >
                      <IconComponent className="w-2.5 h-2.5 shrink-0" />
                      <span>{item.badge}</span>
                    </span>
                    <span className="text-white font-medium tracking-wide">
                      {item.text}
                    </span>
                    <span className="text-emerald-400/60 pl-4 sm:pl-6 select-none" aria-hidden="true">
                      ✦
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled ? 'glass-header' : 'bg-[#090909]/90 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[62px] sm:min-h-[82px] py-2 sm:py-2">
            {/* Brand Logo: Cleanly aligned on the left across all screens with proper padding */}
            <div
              onClick={() => onNavigate('/')}
              className="cursor-pointer flex items-center shrink-0 py-0.5"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('/')}
              aria-label="Navigate to Home"
            >
              <LogoLockup size="responsive" className="inline-flex items-center" />
            </div>

            {/* Desktop Navigation Links with Warm Luxury Styling matching reference */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
              {navLinks.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`text-sm font-semibold transition-all duration-200 px-3.5 py-1.5 rounded-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-3.5 right-3.5 h-[2.5px] bg-[#DEAC5D] rounded-full shadow-[0_0_10px_rgba(222,172,93,0.7)]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Phone + Order Online + PWA Install (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center gap-4">
              <PWAInstallButton compact />

              {/* Phone contact section with emerald circle */}
              <div className="flex items-center gap-2.5 text-xs text-white border-r border-[#2A2A2A] pr-4">
                <a
                  href={`tel:+91${settings.phonePrimary}`}
                  className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-105 transition shadow-[0_0_12px_rgba(22,139,79,0.4)]"
                  aria-label={`Call Pillaiyarappa ${settings.phonePrimary}`}
                >
                  <Phone className="w-4 h-4 fill-current" />
                </a>
                <div className="leading-tight">
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Order By Call</span>
                  <span className="font-bold tracking-tight text-white whitespace-nowrap">
                    M. {settings.phonePrimary} / {settings.phoneSecondary}
                  </span>
                </div>
              </div>

              {/* Emerald Order Online Pill Button with Phone Icon matching reference */}
              <button
                onClick={onOpenOrderModal}
                className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-[#168B4F] hover:bg-[#127742] px-4.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:shadow-[0_4px_24px_rgba(22,139,79,0.45)] transition active:scale-95 shadow-md cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Order Online</span>
              </button>

              {/* Desktop Cart Button */}
              {totalCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    openCartDrawer();
                  }}
                  aria-label={`View Cart: ${totalCount} items`}
                  className="interactive-press relative inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/60 hover:border-emerald-400 px-3.5 py-2 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(22,139,79,0.3)] transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-display font-black">₹{totalAmount}</span>
                  <span className="w-5 h-5 rounded-full bg-[#168B4F] text-white text-[10px] font-black flex items-center justify-center">
                    {totalCount}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Right Action: Cart Button + Ultra-Premium Order CTA Pill + Hamburger Menu Button side-by-side */}
            <div className="flex sm:hidden items-center gap-2 shrink-0">
              {totalCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    openCartDrawer();
                  }}
                  aria-label={`Cart (${totalCount})`}
                  className="interactive-press relative w-8.5 h-8.5 rounded-full bg-[#0d2116] border border-emerald-500/60 text-white flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(22,139,79,0.35)]"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center shadow-xs">
                    {totalCount}
                  </span>
                </button>
              )}

              {/* Ultra-Premium Mobile Order Button */}
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onOpenOrderModal();
                }}
                className="btn-shimmer interactive-press inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#168B4F] via-[#1aa05b] to-[#127742] hover:brightness-110 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-white border border-emerald-400/40 shadow-[0_0_16px_rgba(22,139,79,0.45)] transition-all cursor-pointer"
                aria-label="Order Online & Delivery"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span>ORDER</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setMobileDrawerOpen(!mobileDrawerOpen);
                }}
                className="interactive-press w-9 h-9 rounded-xl text-white hover:text-emerald-400 hover:bg-white/10 active:scale-90 transition-all focus:outline-none cursor-pointer flex flex-col items-center justify-center gap-1.5 border border-white/10 bg-white/[0.04]"
                aria-label={mobileDrawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileDrawerOpen}
              >
                <span
                  className={`block h-0.5 w-4.5 bg-white rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileDrawerOpen ? 'rotate-45 translate-y-2 bg-emerald-400' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-4.5 bg-white rounded-full transition-all duration-200 ease-out ${
                    mobileDrawerOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-4.5 bg-white rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileDrawerOpen ? '-rotate-45 -translate-y-2 bg-emerald-400' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 flex sm:hidden bg-black/80 backdrop-blur-xl animate-drawer-backdrop"
        >
          <div className="w-4/5 max-w-xs h-full bg-[#121212]/95 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-[16px_0_50px_rgba(0,0,0,0.85)] animate-drawer-slide">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div
                  onClick={() => {
                    onNavigate('/');
                    setMobileDrawerOpen(false);
                  }}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onNavigate('/');
                      setMobileDrawerOpen(false);
                    }
                  }}
                  aria-label="Go to Home"
                >
                  <LogoLockup size="sm" />
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 hover:rotate-90 active:scale-90 transition-all duration-300 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links with Staggered Slide In */}
              <nav className="mt-6 space-y-1.5">
                {navLinks.map((item, idx) => {
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        setMobileDrawerOpen(false);
                      }}
                      style={{ animationDelay: `${(idx + 1) * 50}ms` }}
                      className={`animate-drawer-item interactive-press w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-white font-extrabold shadow-[0_0_24px_-2px_rgba(22,139,79,0.5)] border border-emerald-400/40 translate-x-1'
                          : 'text-white hover:bg-white/5 hover:text-emerald-400 hover:translate-x-1'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                        {item.label}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'translate-x-0.5 opacity-100 text-white' : 'opacity-60'}`} />
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setMobileDrawerOpen(false);
                  }}
                  style={{ animationDelay: `${(navLinks.length + 1) * 50}ms` }}
                  className="animate-drawer-item interactive-press w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-dashed border-white/10 mt-3 cursor-pointer"
                >
                  <span>Admin Management</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </nav>

              {/* Install PWA inside drawer */}
              <div
                style={{ animationDelay: `${(navLinks.length + 2) * 50}ms` }}
                className="animate-drawer-item mt-5 pt-4 border-t border-white/10"
              >
                <PWAInstallButton />
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              style={{ animationDelay: `${(navLinks.length + 3) * 50}ms` }}
              className="animate-drawer-item pt-6 border-t border-white/10 space-y-3"
            >
              <button
                onClick={() => {
                  onOpenOrderModal();
                  setMobileDrawerOpen(false);
                }}
                className="btn-shimmer interactive-press w-full py-3.5 rounded-xl bg-emerald-500 font-extrabold uppercase tracking-wider text-white text-xs shadow-[0_8px_24px_rgba(22,139,79,0.4)] transition cursor-pointer"
              >
                Order Online (Zomato / Swiggy)
              </button>
              <a
                href={getSmartWhatsAppUrl(
                  settings.whatsappNumber,
                  getPageWhatsAppMessage(currentPath)
                )}
                onClick={(e) =>
                  handleWhatsAppLinkClick(
                    e,
                    settings.whatsappNumber,
                    getPageWhatsAppMessage(currentPath)
                  )
                }
                target={isMobileDevice() ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="interactive-press w-full py-3 rounded-xl bg-[#168B4F] hover:bg-[#127742] font-bold text-white text-xs flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(22,139,79,0.35)] transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp (9953919033)</span>
              </a>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`tel:+91${settings.phonePrimary}`} className="hover:text-white interactive-press">
                  {settings.phonePrimary}
                </a>
                <span>•</span>
                <a href={`tel:+91${settings.phoneSecondary}`} className="hover:text-white interactive-press">
                  {settings.phoneSecondary}
                </a>
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div
            className="flex-1"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
};
