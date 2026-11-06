import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { Branch, SiteSettings } from '../../types';
import { CheckCircle2, MessageCircle, AlertCircle, Send, Sparkles } from 'lucide-react';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  DEFAULT_WHATSAPP_MESSAGES,
  isMobileDevice,
} from '../../utils/whatsapp';

interface CateringFormProps {
  branches: Branch[];
  settings: SiteSettings;
}

export const CateringForm: React.FC<CateringFormProps> = ({ branches, settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Family Gathering & Puja',
    guestCount: 50,
    eventDate: '',
    preferredBranch: branches[0]?.address || 'South City-1',
    message: '',
    website_hp: '', // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters).';
    }

    // Indian 10-digit mobile number validation (starts with 6,7,8,9)
    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g., 9899101195).';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.guestCount && formData.guestCount < 10) {
      newErrors.guestCount = 'Minimum guest count for catering orders is 10 persons.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check (bot submission)
    if (formData.website_hp) {
      setSubmitted(true);
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    try {
      const enquiry = appStore.addEnquiry({
        type: 'catering',
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        eventType: formData.eventType,
        guestCount: Number(formData.guestCount),
        eventDate: formData.eventDate || undefined,
        preferredBranch: formData.preferredBranch,
        message: formData.message.trim() || 'No additional notes provided.',
      });

      setSubmittedEnquiryId(enquiry.id);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventType: 'Family Gathering & Puja',
        guestCount: 50,
        eventDate: '',
        preferredBranch: branches[0]?.address || 'South City-1',
        message: '',
        website_hp: '',
      });
    } catch (err) {
      console.error('Failed to submit catering enquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMsg = submittedEnquiryId
    ? `Hello Pillaiyarappa! I submitted catering enquiry #${submittedEnquiryId}. ${DEFAULT_WHATSAPP_MESSAGES.catering}`
    : DEFAULT_WHATSAPP_MESSAGES.catering;
  const whatsappPrefilledUrl = getSmartWhatsAppUrl(settings.whatsappNumber, whatsappMsg);

  if (submitted) {
    return (
      <div className="rounded-2xl glass-panel-elevated border border-emerald-500/50 p-6 sm:p-8 text-center space-y-4 animate-fade-in shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl glass-badge flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-display font-black text-2xl text-white">
          Enquiry Received Successfully!
        </h3>
        <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
          Thank you! Our catering team at Pillaiyarappa has received your request. We will review your event details and call you at your mobile number promptly.
        </p>

        {/* WhatsApp Fast Track Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappPrefilledUrl}
            onClick={(e) => handleWhatsAppLinkClick(e, settings.whatsappNumber, whatsappMsg)}
            target={isMobileDevice() ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="btn-shimmer interactive-press inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition shadow-[0_4px_20px_rgba(22,139,79,0.4)] w-full sm:w-auto justify-center"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat Directly on WhatsApp</span>
          </a>
          <button
            onClick={() => setSubmitted(false)}
            className="glass-pill interactive-press rounded-xl px-5 py-3 text-sm font-semibold text-gray-300 hover:text-white transition w-full sm:w-auto"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
      {/* Anti-spam honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp">Do not fill this</label>
        <input
          type="text"
          id="website_hp"
          value={formData.website_hp}
          onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="catering-name" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Full Name <span className="text-emerald-400">*</span>
          </label>
          <input
            id="catering-name"
            type="text"
            required
            placeholder="e.g. Ramesh Iyer"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full rounded-xl glass-input px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none ${
              errors.name ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="catering-phone" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Phone Number <span className="text-emerald-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-xs font-bold text-gray-400">+91</span>
            <input
              id="catering-phone"
              type="tel"
              required
              maxLength={10}
              placeholder="9899101195"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full rounded-xl glass-input pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none ${
                errors.phone ? 'border-red-500' : 'border-white/10'
              }`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Event Type */}
        <div>
          <label htmlFor="catering-event-type" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Event Type
          </label>
          <select
            id="catering-event-type"
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            className="w-full rounded-xl glass-input px-3 py-3 text-sm text-white focus:outline-none"
          >
            <option value="Family Gathering & Puja" className="bg-[#1B1B1B]">Family Gathering &amp; Puja</option>
            <option value="Birthday Party" className="bg-[#1B1B1B]">Birthday Party</option>
            <option value="Corporate Lunch / Meeting" className="bg-[#1B1B1B]">Corporate Lunch / Meeting</option>
            <option value="Wedding / Reception Function" className="bg-[#1B1B1B]">Wedding Function</option>
            <option value="Housewarming (Griha Pravesh)" className="bg-[#1B1B1B]">Housewarming</option>
            <option value="Other Celebration" className="bg-[#1B1B1B]">Other Celebration</option>
          </select>
        </div>

        {/* Guest Count */}
        <div>
          <label htmlFor="catering-guests" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            No. of Guests
          </label>
          <input
            id="catering-guests"
            type="number"
            min={10}
            max={2000}
            value={formData.guestCount}
            onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
            className={`w-full rounded-xl glass-input px-4 py-3 text-sm text-white focus:outline-none ${
              errors.guestCount ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.guestCount && <p className="mt-1 text-xs text-red-400">{errors.guestCount}</p>}
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="catering-date" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Event Date
          </label>
          <input
            id="catering-date"
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            className="w-full rounded-xl glass-input px-4 py-3 text-sm text-white focus:outline-none"
          >
          </input>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email (Optional) */}
        <div>
          <label htmlFor="catering-email" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Email Address <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            id="catering-email"
            type="email"
            placeholder="you@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full rounded-xl glass-input px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none ${
              errors.email ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        {/* Preferred Branch */}
        <div>
          <label htmlFor="catering-branch" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Preferred Branch Location
          </label>
          <select
            id="catering-branch"
            value={formData.preferredBranch}
            onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
            className="w-full rounded-xl glass-input px-3 py-3 text-sm text-white focus:outline-none"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.address} className="bg-[#1B1B1B]">
                {b.name} — {b.address.split(',')[1] || b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message / Special Menu Requirements */}
      <div>
        <label htmlFor="catering-message" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
          Special Menu Requirements / Dishes Needed
        </label>
        <textarea
          id="catering-message"
          rows={3}
          placeholder="e.g. Need Live Masala Dosa counter, Ghee Podi Idlis, Medu Vada and South Indian Filter Coffee setup..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-xl glass-input px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-shimmer interactive-press w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-display font-black text-sm uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(22,139,79,0.35)] transition"
      >
        <Send className="w-4 h-4" />
        <span>{submitting ? 'Submitting Enquiry...' : 'Submit Catering Enquiry'}</span>
      </button>

      <p className="text-[11px] text-gray-400 text-center">
        🔒 Your contact information is kept private and used exclusively to coordinate your catering requirements.
      </p>
    </form>
  );
};
