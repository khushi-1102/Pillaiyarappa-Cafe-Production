import React from 'react';
import { useCart } from '../../hooks/useCart';
import { triggerHaptic } from '../../utils/haptics';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { totalCount, totalAmount, openCartDrawer } = useCart();

  if (totalCount === 0) return null;

  const freeDeliveryThreshold = 500;
  const isFreeDelivery = totalAmount >= freeDeliveryThreshold;
  const amountNeeded = freeDeliveryThreshold - totalAmount;

  const handleClick = () => {
    triggerHaptic('medium');
    openCartDrawer();
  };

  return (
    <>
      {/* Mobile Floating Bar — Sits safely above MobileStickyBar with full safe-area clearance */}
      <div className="sm:hidden fixed bottom-[calc(78px+env(safe-area-inset-bottom,0px))] left-3 right-3 z-50 animate-bounce-in">
        <button
          type="button"
          onClick={handleClick}
          aria-label={`View cart with ${totalCount} items, total ₹${totalAmount}`}
          className="w-full rounded-2xl bg-gradient-to-r from-[#168B4F] via-[#127742] to-[#0d5930] p-2.5 sm:p-3 text-white shadow-[0_12px_36px_rgba(22,139,79,0.55)] border border-emerald-400/40 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform gap-2"
        >
          {/* Left: Cart badge & total */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-9 h-9 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
              <ShoppingBag className="w-4.5 h-4.5 text-white" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            </div>

            <div className="flex flex-col text-left min-w-0">
              <span className="font-display font-extrabold text-xs sm:text-sm tracking-wide text-white truncate">
                {totalCount} {totalCount === 1 ? 'Item' : 'Items'} • ₹{totalAmount}
              </span>
              <span className="text-[10px] text-emerald-100 font-semibold flex items-center gap-1 truncate">
                {isFreeDelivery ? (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span className="truncate">Free Delivery (3 km) Unlocked!</span>
                  </>
                ) : (
                  <span className="truncate">Add ₹{amountNeeded} for Free Delivery</span>
                )}
              </span>
            </div>
          </div>

          {/* Right: View Cart Button */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/15 shrink-0">
            <span className="font-display font-black text-xs uppercase tracking-wider text-white whitespace-nowrap">
              View Cart
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Desktop Floating Pill — Bottom right */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleClick}
          aria-label={`View cart with ${totalCount} items, total ₹${totalAmount}`}
          className="group rounded-full bg-[#121212]/95 backdrop-blur-2xl border border-emerald-500/50 hover:border-emerald-400 p-2 pr-5 text-white shadow-[0_16px_40px_rgba(22,139,79,0.35)] hover:shadow-[0_20px_50px_rgba(22,139,79,0.55)] flex items-center gap-4 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          {/* Cart Icon in green circle */}
          <div className="relative w-11 h-11 rounded-full bg-[#168B4F] flex items-center justify-center shadow-[0_0_16px_rgba(22,139,79,0.6)]">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center shadow-md">
              {totalCount}
            </span>
          </div>

          {/* Text Info */}
          <div className="flex flex-col text-left">
            <span className="font-display font-black text-sm text-white tracking-wide">
              ₹{totalAmount}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">
              {totalCount} {totalCount === 1 ? 'Dish' : 'Dishes'} in Cart
            </span>
          </div>

          {/* Action pill */}
          <div className="ml-1 px-3 py-1.5 rounded-full bg-emerald-500/20 group-hover:bg-[#168B4F] text-emerald-300 group-hover:text-white border border-emerald-500/30 flex items-center gap-1.5 transition-colors">
            <span className="font-display font-black text-xs uppercase tracking-wider">
              Checkout
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </>
  );
};
