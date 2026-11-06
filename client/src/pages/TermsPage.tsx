import React from 'react';
import { VineDivider } from '../components/brand/VineDivider';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090909] text-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider glass-badge">
            Service Terms
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400">
            Pillaiyarappa — South Indian Corner, Gurugram
          </p>
        </div>

        <VineDivider className="my-4" />

        <div className="rounded-3xl glass-panel-elevated p-6 sm:p-10 space-y-6 text-sm text-gray-300 leading-relaxed shadow-2xl">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">1. Home Delivery Policy</h2>
            <p>
              Free In-House Delivery is provided on orders with a minimum bill value of ₹500/- strictly within a 3.0 km radius from our South City-1 and Sector-40 Huda Market outlets in Gurugram. For addresses beyond 3.0 km, customers are encouraged to order via Zomato or Swiggy, or arrange direct self-pickup / Dunzo.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">2. External Ordering Platforms</h2>
            <p>
              Orders placed through third-party platforms like Zomato and Swiggy are subject to their respective terms of service, delivery partner schedules, and pricing guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">3. Catering Orders</h2>
            <p>
              Party and catering reservations require mutual confirmation of menu items, guest numbers, and timing with our restaurant coordinator. Advance notice is appreciated for live counter setups and bulk thali packages.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-400">4. 100% Pure Vegetarian Assurance</h2>
            <p>
              All items prepared in our kitchens are strictly pure vegetarian. We maintain strict segregation and adherence to authentic traditional preparation methods.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
