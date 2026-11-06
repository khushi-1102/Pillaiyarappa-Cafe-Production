import React, { useState } from 'react';
import { SiteSettings, Branch } from '../types';
import { appStore } from '../services/store';
import { VineDivider } from '../components/brand/VineDivider';
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle2, Instagram } from 'lucide-react';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  DEFAULT_WHATSAPP_MESSAGES,
  isMobileDevice,
} from '../utils/whatsapp';

interface ContactPageProps {
  settings: SiteSettings;
  branches: Branch[];
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, branches }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please provide your name.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setError('');
    appStore.addEnquiry({
      type: 'contact',
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim() || 'General inquiry / callback request.',
    });
    setSubmitted(true);
    setFormData({ name: '', phone: '', message: '' });
  };

  const contactMsg = DEFAULT_WHATSAPP_MESSAGES.contact;
  const whatsappHref = getSmartWhatsAppUrl(settings.whatsappNumber, contactMsg);

  return (
    <div className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge">
            Get In Touch
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Contact Pillaiyarappa
          </h1>
          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            We are always here to serve you. Call us for deliveries, catering consultations, or visit our branches.
          </p>
        </div>

        <VineDivider className="mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Direct Phone & WhatsApp Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary Phone */}
            <div className="p-5 sm:p-6 rounded-2xl glass-card space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Telephone &amp; Delivery Orders
              </span>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="font-display font-black text-xl text-white">9899101195</p>
                  <p className="text-xs text-emerald-400 font-semibold">Primary Restaurant Line</p>
                </div>
                <a
                  href={`tel:+91${settings.phonePrimary}`}
                  className="btn-shimmer interactive-press rounded-full bg-emerald-500 px-5 py-2.5 font-bold text-xs uppercase tracking-wider text-white hover:bg-emerald-400 transition shadow-[0_4px_16px_rgba(22,139,79,0.3)]"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Secondary Phone */}
            <div className="p-5 sm:p-6 rounded-2xl glass-card space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Alternate Mobile
              </span>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="font-display font-black text-xl text-white">9953919033</p>
                  <p className="text-xs text-emerald-400 font-semibold">Secondary Line</p>
                </div>
                <a
                  href={`tel:+91${settings.phoneSecondary}`}
                  className="btn-shimmer interactive-press rounded-full bg-emerald-500 px-5 py-2.5 font-bold text-xs uppercase tracking-wider text-white hover:bg-emerald-400 transition shadow-[0_4px_16px_rgba(22,139,79,0.3)]"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={whatsappHref}
              onClick={(e) => handleWhatsAppLinkClick(e, settings.whatsappNumber, contactMsg)}
              target={isMobileDevice() ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 sm:p-6 rounded-2xl glass-panel border border-emerald-500/40 hover:border-emerald-500/70 hover:bg-emerald-950/20 transition group interactive-press shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">WhatsApp Instant Chat</p>
                  <p className="text-xs text-emerald-300 font-medium">+91 9953919033 • Quick responses</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">Chat →</span>
            </a>

            {/* Email */}
            <div className="p-5 sm:p-6 rounded-2xl glass-card flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl glass-badge text-emerald-400 flex items-center justify-center shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Official Email</p>
                <a href={`mailto:${settings.contactEmail}`} className="font-bold text-sm text-white hover:text-emerald-400 transition break-all">
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            {/* Official Instagram */}
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 sm:p-6 rounded-2xl glass-card border border-pink-500/30 hover:border-pink-500/70 hover:bg-pink-950/20 transition group interactive-press shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Official Instagram</p>
                  <p className="text-xs text-pink-300 font-medium">@pillaiyarappa_southindian</p>
                </div>
              </div>
              <span className="text-xs font-bold text-pink-400 group-hover:translate-x-1 transition-transform">Follow →</span>
            </a>

          </div>

          {/* Right Column: Callback Request Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-panel-elevated p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="mb-6 pb-4 border-b border-white/10">
                <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                  Request a Callback
                </h2>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Leave your number and query, and our team will call you back shortly.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl glass-badge flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">Callback Request Submitted!</h3>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                    We have noted your details and will call you back at your earliest convenience.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 glass-pill interactive-press rounded-xl px-6 py-2.5 text-xs font-bold text-white hover:text-emerald-300 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Your Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl glass-input px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Mobile Number <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs font-bold text-gray-400">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9899101195"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl glass-input pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Message / Query
                    </label>
                    <textarea
                      rows={3}
                      placeholder="What would you like assistance with?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl glass-input px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-shimmer interactive-press w-full py-3.5 rounded-xl bg-emerald-500 font-display font-black text-xs uppercase tracking-wider text-white hover:bg-emerald-400 transition flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(22,139,79,0.35)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
