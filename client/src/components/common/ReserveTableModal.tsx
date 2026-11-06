import React, { useState } from 'react';
import { X, CalendarDays, Clock, Users, User, Phone, Mail, MessageSquare, Check, Loader2, Utensils } from 'lucide-react';
import { appStore } from '../../services/store';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  isMobileDevice,
  sanitizeWhatsAppNumber,
} from '../../utils/whatsapp';

interface ReserveTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  branchAddress: string;
  branchId: string;
  branchSlug: string;
  whatsappNumber: string;
}

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];

export const ReserveTableModal: React.FC<ReserveTableModalProps> = ({
  isOpen,
  onClose,
  branchName,
  branchAddress,
  branchId,
  branchSlug,
  whatsappNumber,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    date: '',
    time: '',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  // Max date: 30 days from now
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const formatTime12h = (time24: string) => {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const triggerForceWhatsAppRedirect = (phoneNum: string, message: string) => {
    const cleanPhone = sanitizeWhatsAppNumber(phoneNum);
    const encodedText = encodeURIComponent(message);
    const nativeUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;
    const apiFallbackUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

    if (isMobileDevice()) {
      // Mobile: Force native app launch immediately
      window.location.href = nativeUrl;
      setTimeout(() => {
        if (typeof document !== 'undefined' && (document.hasFocus() || !document.hidden)) {
          window.location.href = apiFallbackUrl;
        }
      }, 1400);
    } else {
      // Desktop: Open WhatsApp Web directly in new tab or navigate
      const newTab = window.open(webUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = apiFallbackUrl;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    const bookingMsg = `Hello Pillaiyarappa! I would like to reserve a table at ${branchName} (Sector-40, HUDA Market).\n\n📋 Booking Details:\n👤 Name: ${formData.name.trim()}\n📱 Phone: ${formData.phone.trim()}\n👥 Guests: ${formData.guests} Person(s)\n📅 Date: ${formatDate(formData.date)}\n⏰ Time: ${formatTime12h(formData.time)}${formData.specialRequests.trim() ? `\n📝 Special Request: ${formData.specialRequests.trim()}` : ''}\n\nPlease confirm my table reservation. Thank you!`;

    setIsSubmitting(true);
    setIsSubmitted(true);

    // 1. FORCIBLY and IMMEDIATELY redirect to WhatsApp! Zero choice or delay given to customer
    triggerForceWhatsAppRedirect(whatsappNumber, bookingMsg);

    // 2. Concurrently record the table reservation into the database & admin panel
    try {
      await appStore.submitReservation({
        branchId,
        branchSlug,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        guests: formData.guests,
        date: formData.date,
        time: formData.time,
        specialRequests: formData.specialRequests.trim() || undefined,
      });
    } catch (err: any) {
      console.error('[Reservation] Sync error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      guests: 2,
      date: '',
      time: '',
      specialRequests: '',
    });
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  const whatsappConfirmMsg = `Hello Pillaiyarappa! I would like to reserve a table at ${branchName} (Sector-40, HUDA Market).\n\n📋 Booking Details:\n👤 Name: ${formData.name.trim()}\n📱 Phone: ${formData.phone.trim()}\n👥 Guests: ${formData.guests} Person(s)\n📅 Date: ${formatDate(formData.date)}\n⏰ Time: ${formatTime12h(formData.time)}${formData.specialRequests.trim() ? `\n📝 Special Request: ${formData.specialRequests.trim()}` : ''}\n\nPlease confirm my table reservation. Thank you!`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[92vh] bg-[#1B1B1B] border border-[#2A2A2A] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/10 bg-gradient-to-br from-emerald-950/60 via-[#1B1B1B] to-[#1B1B1B]">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(22,139,79,0.4)]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
                Reserve a Table
              </h2>
              <p className="text-xs text-emerald-400 font-semibold">{branchName} — {branchAddress}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSubmitted ? (
            /* Automatic WhatsApp Redirection State */
            <div className="text-center space-y-5 py-6">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-[#25D366] text-black flex items-center justify-center shadow-[0_0_35px_rgba(37,211,102,0.6)] animate-pulse">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.216l-.252-.154-2.787.828.76-2.787-.168-.268A8 8 0 1112 20z"/>
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Redirecting to WhatsApp</span>
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-wide">
                  Opening WhatsApp Chat...
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
                  Your table reservation for <strong className="text-emerald-400">{formData.guests} guests</strong> on{' '}
                  <strong className="text-white">{formatDate(formData.date)}</strong> at{' '}
                  <strong className="text-white">{formatTime12h(formData.time)}</strong> has been registered.
                </p>
                <p className="text-xs text-amber-300/90 font-medium">
                  Redirecting you to WhatsApp to send your booking confirmation.
                </p>
              </div>

              {/* Instant / Fallback Direct Button */}
              <div className="pt-2">
                <a
                  href={getSmartWhatsAppUrl(whatsappNumber, whatsappConfirmMsg)}
                  onClick={(e) => {
                    handleWhatsAppLinkClick(e, whatsappNumber, whatsappConfirmMsg);
                  }}
                  target={isMobileDevice() ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="interactive-press inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs uppercase tracking-wider shadow-[0_4px_25px_rgba(37,211,102,0.45)] transition w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.216l-.252-.154-2.787.828.76-2.787-.168-.268A8 8 0 1112 20z"/>
                  </svg>
                  <span>Click here if WhatsApp didn't open</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="block w-full mt-2 text-xs text-gray-500 hover:text-white transition"
              >
                Close Window
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-300 mb-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-[#222222] border border-[#333333] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-300 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl bg-[#222222] border border-[#333333] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-300 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Email <span className="text-gray-500 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl bg-[#222222] border border-[#333333] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              {/* Guests Selector */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-300 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Number of Guests <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GUEST_OPTIONS.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, guests: num })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        formData.guests === num
                          ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(22,139,79,0.4)] scale-105'
                          : 'bg-[#222222] border border-[#333333] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-300 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    max={maxDate}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-300 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Time <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition [color-scheme:dark]"
                  >
                    <option value="" disabled>Select time</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{formatTime12h(slot)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-300 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Special Requests <span className="text-gray-500 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  placeholder="Birthday celebration, high chair needed, dietary requirements..."
                  rows={2}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full rounded-xl bg-[#222222] border border-[#333333] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-shimmer interactive-press w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-display font-black text-sm uppercase tracking-wider text-white transition shadow-[0_8px_28px_rgba(22,139,79,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving...</span>
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    <span>Reserve My Table</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                By reserving, you agree to our booking policy. Reservations are subject to confirmation. 
                We'll call or WhatsApp you to confirm within 30 minutes during operating hours.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
