/**
 * WhatsApp Universal Link & Redirection Utility
 * Provides flawless direct chat behavior across Phone (Mobile WhatsApp App)
 * and Laptop / Desktop (WhatsApp Web direct chat space)
 * with context-aware preloaded messages per page.
 */

export const DEFAULT_WHATSAPP_NUMBER = '919953919033';

export const DEFAULT_WHATSAPP_MESSAGES = {
  catering: 'Hello Pillaiyarappa! I would like to inquire about party and event catering. Please share menu options and packages.',
  order: "Hello Pillaiyarappa! I would like to place an online order for home delivery. Please share today's menu and packages.",
  menu: 'Hello Pillaiyarappa! I would like to explore the menu and order fresh South Indian food.',
  contact: 'Hello Pillaiyarappa! I would like to get in touch regarding your Gurugram restaurant and catering.',
  branches: 'Hello Pillaiyarappa! I would like to inquire about your South City-1 and Sec-40 Huda Market branches in Gurugram.',
  about: 'Hello Pillaiyarappa! I would like to learn more about your authentic South Indian restaurant in Gurugram.',
  gallery: 'Hello Pillaiyarappa! I saw your delicious food gallery and would like to place an order / inquire about catering.',
  general: 'Hello Pillaiyarappa! I would like to place an order / inquire about catering.',
};

/**
 * Returns the exact contextual pre-loaded WhatsApp message based on current page path.
 * If user is on /catering, returns the exact requested catering message.
 */
export function getPageWhatsAppMessage(path?: string, customMessage?: string): string {
  if (customMessage && customMessage.trim().length > 0) {
    return customMessage.trim();
  }
  const cleanPath = (path || (typeof window !== 'undefined' ? window.location.pathname : '')).toLowerCase();

  if (cleanPath.includes('catering')) {
    return DEFAULT_WHATSAPP_MESSAGES.catering;
  }
  if (cleanPath.includes('menu')) {
    return DEFAULT_WHATSAPP_MESSAGES.menu;
  }
  if (cleanPath.includes('contact')) {
    return DEFAULT_WHATSAPP_MESSAGES.contact;
  }
  if (cleanPath.includes('branch')) {
    return DEFAULT_WHATSAPP_MESSAGES.branches;
  }
  if (cleanPath.includes('about')) {
    return DEFAULT_WHATSAPP_MESSAGES.about;
  }
  if (cleanPath.includes('gallery')) {
    return DEFAULT_WHATSAPP_MESSAGES.gallery;
  }
  return DEFAULT_WHATSAPP_MESSAGES.general;
}

/**
 * Clean phone number to international format without + or spaces (e.g. 919953919033)
 */
export function sanitizeWhatsAppNumber(phone?: string): string {
  if (!phone) return DEFAULT_WHATSAPP_NUMBER;
  const digits = phone.replace(/\D/g, '');
  // Guard against old primary phone number 9899101195 being mistakenly passed as WhatsApp
  if (digits === '9899101195' || digits === '919899101195') {
    return DEFAULT_WHATSAPP_NUMBER;
  }
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits.length >= 10 ? digits : DEFAULT_WHATSAPP_NUMBER;
}

/**
 * Returns true if the client is on a mobile device / phone / tablet
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0))
  );
}

/**
 * Direct WhatsApp API URL with explicit ?phone= and ?text= parameters.
 * Highly reliable across all mobile browsers.
 */
export function getWhatsAppApiUrl(phone?: string, message?: string): string {
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const text = (message && message.trim().length > 0)
    ? message.trim()
    : DEFAULT_WHATSAPP_MESSAGES.general;
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
}

/**
 * Native custom URI scheme format for mobile apps.
 * Directly launches WhatsApp application into the chat room with the target phone number,
 * completely bypassing the intermediate "Continue to Chat" web screen
 * and preventing the "Send to..." contact picker share-sheet glitch.
 */
export function getWhatsAppNativeUrl(phone?: string, message?: string): string {
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const text = (message && message.trim().length > 0)
    ? message.trim()
    : DEFAULT_WHATSAPP_MESSAGES.general;
  return `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
}

/**
 * Universal wa.me link format.
 */
export function getWaMeUrl(phone?: string, message?: string): string {
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const text = (message && message.trim().length > 0)
    ? message.trim()
    : DEFAULT_WHATSAPP_MESSAGES.general;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Direct WhatsApp Web URL format for laptops and desktop browsers.
 */
export function getWhatsAppWebUrl(phone?: string, message?: string): string {
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const text = (message && message.trim().length > 0)
    ? message.trim()
    : DEFAULT_WHATSAPP_MESSAGES.general;
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
}

/**
 * Device-aware WhatsApp URL for href attributes:
 * - On Mobile: api.whatsapp.com with explicit ?phone= parameter
 * - On Desktop/Laptop: web.whatsapp.com for direct WhatsApp Web chat
 */
export function getSmartWhatsAppUrl(phone?: string, message?: string): string {
  if (isMobileDevice()) {
    return getWhatsAppApiUrl(phone, message);
  }
  return getWhatsAppWebUrl(phone, message);
}

/**
 * Click handler to attach to <a> and <button> tags:
 * - On Mobile: Directs straight into the WhatsApp native app chat room via whatsapp://send?phone=...
 *   with fallback to https://api.whatsapp.com/send?phone=...
 *   This ensures 100% direct chat space opening and ZERO "Send to..." contact picker screen.
 * - On Desktop / Laptop: Opens WhatsApp Web directly in a new tab.
 */
export function handleWhatsAppLinkClick(
  e: React.MouseEvent<any>,
  phone?: string,
  message?: string
): void {
  e.preventDefault();
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const text = (message && message.trim().length > 0)
    ? message.trim()
    : DEFAULT_WHATSAPP_MESSAGES.general;
  const encodedText = encodeURIComponent(text);

  if (isMobileDevice()) {
    // 1. Mobile App Direct Deep Link: launches the chat directly in WhatsApp app
    const nativeUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;
    const apiFallbackUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

    // Navigate in current window to trigger OS intent
    window.location.href = nativeUrl;

    // Fallback if custom scheme isn't handled after timeout
    setTimeout(() => {
      if (typeof document !== 'undefined' && (document.hasFocus() || !document.hidden)) {
        window.location.href = apiFallbackUrl;
      }
    }, 1400);
  } else {
    // 2. Desktop / Laptop: Open WhatsApp Web directly in a new tab
    const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}
