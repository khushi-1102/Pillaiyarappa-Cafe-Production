import React from 'react';
import { SiteSettings, Branch } from '../types';
import { CateringForm } from '../components/forms/CateringForm';
import { VineDivider } from '../components/brand/VineDivider';
import { Utensils, Users, Coffee, Sparkles, Phone, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  DEFAULT_WHATSAPP_MESSAGES,
  isMobileDevice,
} from '../utils/whatsapp';

interface CateringPageProps {
  settings: SiteSettings;
  branches: Branch[];
}

export const CateringPage: React.FC<CateringPageProps> = ({ settings, branches }) => {
  const cateringMsg = DEFAULT_WHATSAPP_MESSAGES.catering;
  const whatsappHref = getSmartWhatsAppUrl(settings.whatsappNumber, cateringMsg);

  return (
    <div className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge">
            Parties • Pujas • Corporate Events
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Parties &amp; Catering Orders
          </h1>
          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Bring the authentic taste of South India to your special occasions across Gurugram and Delhi NCR.
          </p>
        </div>

        <VineDivider className="mb-10" />

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-5 rounded-2xl space-y-3 group">
            <div className="w-11 h-11 rounded-xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
              Live Dosa Counters
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Chef cooking fresh, piping hot plain, masala, and Mysore dosas right before your guests.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3 group">
            <div className="w-11 h-11 rounded-xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
              Filter Coffee Station
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Traditional decoction filter coffee frothed hot in authentic dabarah tumblers.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3 group">
            <div className="w-11 h-11 rounded-xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
              Puja &amp; Family Gatherings
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Pure vegetarian sathvik preparations for housewarmings (griha pravesh), birthdays and festivals.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3 group">
            <div className="w-11 h-11 rounded-xl glass-badge flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
              Corporate Packed Meals
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Hygienic, leak-proof meal boxes for office conferences and team lunch celebrations.
            </p>
          </div>
        </div>

        {/* Main 2-Column: Left Info & Fast Call, Right Catering Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Call & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 space-y-4 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <h2 className="font-display font-bold text-xl text-emerald-400 uppercase tracking-wide">
                Fast Coordinator Line
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Need to discuss menu items or pricing immediately? Call our catering team directly or connect with us on WhatsApp.
              </p>

              <div className="space-y-3 pt-1">
                <a
                  href={`tel:+91${settings.phonePrimary}`}
                  className="interactive-press w-full flex items-center justify-between p-3.5 rounded-xl glass-panel hover:border-emerald-500/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <Phone className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase font-semibold">Primary Contact</p>
                      <p className="font-bold text-sm text-white">{settings.phonePrimary}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Call Now →</span>
                </a>

                <a
                  href={`tel:+91${settings.phoneSecondary}`}
                  className="interactive-press w-full flex items-center justify-between p-3.5 rounded-xl glass-panel hover:border-emerald-500/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <Phone className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase font-semibold">Secondary Contact</p>
                      <p className="font-bold text-sm text-white">{settings.phoneSecondary}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Call Now →</span>
                </a>

                <a
                  href={whatsappHref}
                  onClick={(e) => handleWhatsAppLinkClick(e, settings.whatsappNumber, cateringMsg)}
                  target={isMobileDevice() ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="btn-shimmer interactive-press w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs uppercase tracking-wider text-white transition shadow-[0_4px_20px_rgba(22,139,79,0.4)]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Checklist */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">What We Provide</h3>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fresh biodegradable banana leaves &amp; plates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited sambar &amp; 3 varieties of fresh chutney</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Experienced uniformed South Indian chefs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full setup, chafing warmers &amp; breakdown service</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Catering Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="mb-6 pb-4 border-b border-white/10">
                <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                  Request a Catering Estimate
                </h2>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Fill in your event details below. Our catering manager will contact you with menu recommendations and competitive pricing.
                </p>
              </div>

              <CateringForm branches={branches} settings={settings} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
