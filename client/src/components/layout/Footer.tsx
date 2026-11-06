import React from 'react';
import { LogoLockup } from '../brand/LogoLockup';
import { LeafPatternDivider } from '../brand/LeafPatternDivider';
import { Phone, MapPin, Clock, ShieldCheck, Lock, ExternalLink, MessageCircle, Instagram, Mail } from 'lucide-react';
import { SiteSettings, Branch } from '../../types';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  DEFAULT_WHATSAPP_MESSAGES,
  isMobileDevice,
} from '../../utils/whatsapp';

interface FooterProps {
  onNavigate: (path: string) => void;
  settings: SiteSettings;
  branches: Branch[];
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings, branches }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white pt-8 pb-32 sm:pb-12 border-t border-[#1C1C1C] relative">
      {/* Custom South Indian Leaf-Patterned Footer Divider */}
      <LeafPatternDivider className="mb-8" withCenterMedallion={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <LogoLockup size="md" />
            <p className="text-xs text-gray-300 leading-relaxed">
              Authentic South Indian corner serving traditional crispy dosas, steaming soft idlis, crunchy vadas, and flavorful uttapams in Gurugram since 2014.
            </p>
            <div className="rounded-2xl glass-panel p-3.5 text-xs space-y-1">
              <span className="text-emerald-400 font-bold block">
                {settings.deliveryOfferText}
              </span>
              <span className="text-gray-300 block text-[11px]">
                {settings.cateringLine}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              Explore Menu
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate('/menu')}
                  className="hover:text-emerald-400 transition"
                >
                  Crispy Dosas (Plain, Masala, Rava)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/menu')}
                  className="hover:text-emerald-400 transition"
                >
                  Steamed Idlis &amp; Ghee Podi Idli
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/menu')}
                  className="hover:text-emerald-400 transition"
                >
                  Golden Medu Vadas &amp; Sambar Vada
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/menu')}
                  className="hover:text-emerald-400 transition"
                >
                  Fluffy Onion Tomato Uttapams
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/menu')}
                  className="hover:text-emerald-400 transition"
                >
                  Filter Coffee &amp; Curd Rice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/gallery')}
                  className="hover:text-emerald-400 transition text-emerald-400/90 font-semibold"
                >
                  View Food &amp; Restaurant Gallery →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Branches in Gurugram */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              Our Branches
            </h3>
            <div className="space-y-3.5 text-xs">
              {branches.map((branch) => (
                <div key={branch.id} className="p-3.5 rounded-2xl glass-card space-y-1.5">
                  <p className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {branch.name}
                  </p>
                  <p className="text-gray-300 leading-snug text-[11px]">{branch.address}</p>
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <a
                        href={`tel:+91${branch.phone}`}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] flex items-center gap-1 interactive-press"
                      >
                        <Phone className="w-3 h-3" />
                        {branch.phone}
                      </a>
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px] interactive-press"
                      >
                        Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {branch.zomatoUrl && (
                      <a
                        href={branch.zomatoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-2.5 rounded-lg bg-[#E23744]/20 hover:bg-[#E23744] text-[#E23744] hover:text-white border border-[#E23744]/40 font-bold text-[11px] flex items-center justify-between transition-all interactive-press group"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#E23744] text-white flex items-center justify-center font-display font-black text-[9px] group-hover:bg-white group-hover:text-[#E23744]">z</span>
                          <span>Order on Zomato</span>
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {branch.swiggyUrl && (
                      <a
                        href={branch.swiggyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-2.5 rounded-lg bg-[#FC8019]/20 hover:bg-[#FC8019] text-[#FC8019] hover:text-white border border-[#FC8019]/40 font-bold text-[11px] flex items-center justify-between transition-all interactive-press group"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#FC8019] text-white flex items-center justify-center font-display font-black text-[9px] group-hover:bg-white group-hover:text-[#FC8019]">S</span>
                          <span>Order on Swiggy</span>
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              Direct Contact
            </h3>
            <div className="space-y-2.5 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href={`tel:+91${settings.phonePrimary}`} className="hover:text-emerald-400 font-bold">
                  9899101195
                </a>
                <span>/</span>
                <a href={`tel:+91${settings.phoneSecondary}`} className="hover:text-emerald-400 font-bold">
                  9953919033
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>10:00 AM – 10:00 PM (All 7 Days)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:text-emerald-400 font-medium text-[11px] break-all"
                  title={settings.contactEmail}
                >
                  {settings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Pure Vegetarian Kitchen</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigate('/catering')}
                className="btn-shimmer interactive-press w-full py-3 px-3 rounded-xl bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition shadow-[0_4px_16px_rgba(22,139,79,0.3)]"
              >
                Catering Enquiry Form
              </button>
              <a
                href={getSmartWhatsAppUrl(settings.whatsappNumber, DEFAULT_WHATSAPP_MESSAGES.general)}
                onClick={(e) =>
                  handleWhatsAppLinkClick(e, settings.whatsappNumber, DEFAULT_WHATSAPP_MESSAGES.general)
                }
                target={isMobileDevice() ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="interactive-press w-full py-2.5 px-3 rounded-xl bg-[#168B4F] hover:bg-[#127742] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(22,139,79,0.3)] transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-press w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(253,29,29,0.25)] transition"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {currentYear} Pillaiyarappa South Indian Corner. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/privacy')}
              className="hover:text-white transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-white transition"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
