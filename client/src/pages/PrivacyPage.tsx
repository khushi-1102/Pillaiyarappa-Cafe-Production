import React from 'react';
import { VineDivider } from '../components/brand/VineDivider';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090909] text-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge">
            Data Privacy &amp; Trust
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400">
            Last Updated: October 2026 • Compliant with Indian DPDP Act 2023 Principles
          </p>
        </div>

        <VineDivider className="my-4" />

        <div className="rounded-3xl glass-panel-elevated p-6 sm:p-10 space-y-6 text-sm text-gray-300 leading-relaxed shadow-2xl">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">1. Introduction</h2>
            <p>
              Pillaiyarappa — South Indian Corner respects your personal privacy. This policy explains how we handle contact and enquiry information collected through our official website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">2. Information We Collect</h2>
            <p>
              We only collect data that you voluntarily provide when submitting a Catering Enquiry or Callback Request:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li>Your Name and 10-digit Indian Mobile Number</li>
              <li>Email Address (optional)</li>
              <li>Event details such as guest count, requested date, and food preferences</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">3. Purpose of Processing</h2>
            <p>
              Your contact details are used solely to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li>Coordinate and confirm catering orders and home delivery requests</li>
              <li>Respond to inquiries submitted via our web forms</li>
              <li>Connect with you via phone call or WhatsApp per your request</li>
            </ul>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              ✓ We NEVER sell, rent, or share your personal phone numbers or contact details with third-party advertisers or telemarketers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">4. Offline &amp; Local Storage</h2>
            <p>
              To ensure uninterrupted functionality in low connectivity areas across Gurugram, our Progressive Web App (PWA) stores menu data and pending enquiries securely in your browser's local cache. Unsynced forms are submitted when your network connection resumes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">5. Contact Us</h2>
            <p>
              For any questions regarding your data, contact our management team at:
            </p>
            <p className="text-xs text-emerald-400 font-mono">
              Phone: 9899101195 / 9953919033 • Email: pillaiyarappasouthindiancorner@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
