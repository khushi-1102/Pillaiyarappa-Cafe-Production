import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { useCart } from '../../hooks/useCart';
import { triggerHaptic } from '../../utils/haptics';
import { playTikSound, playTukSound } from '../../utils/sound';
import { Plus, Minus, Flame, Sparkles } from 'lucide-react';
import { ItemDetailModal } from './ItemDetailModal';

interface FoodCardProps {
  item: MenuItem;
  searchQuery?: string;
  categoryName?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  searchQuery = '',
  categoryName,
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { getItemQuantity, addToCart, removeFromCart } = useCart();
  const quantity = getItemQuantity(item.id);

  const handleCardClick = () => {
    triggerHaptic('light');
    setIsDetailOpen(true);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    playTikSound();
    addToCart(item);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    playTukSound();
    removeFromCart(item.id);
  };

  // Helper for text highlight when searching
  const renderHighlighted = (text: string) => {
    if (!searchQuery.trim()) return text;
    const escaped = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.trim().toLowerCase() ? (
        <mark key={i} className="bg-emerald-500/30 text-emerald-300 font-extrabold rounded-xs px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`${item.name} - ₹${item.price}. Click to view details and full photo`}
        className={`group relative rounded-2xl bg-[#121212]/95 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between overflow-hidden select-none cursor-pointer hover-lift ${
          quantity > 0
            ? 'border-emerald-500/70 shadow-[0_8px_24px_rgba(22,139,79,0.22)] ring-1 ring-emerald-500/30'
            : 'border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_12px_28px_rgba(22,139,79,0.18)] hover:-translate-y-0.5'
        }`}
      >
      {/* 1. Dynamic Food Photo or Elegant Culinary Header (Compact 16:10 proportion) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#1c1c1c] via-[#141414] to-[#0d0d0d]">
        {item.image && item.image.trim() !== '' ? (
          <>
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              onError={(e) => {
                // If image fails to load, hide broken img tag gracefully
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            {/* Soft dark vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25 pointer-events-none" />
          </>
        ) : (
          /* Elegant Minimalist Culinary Pattern when no photo is uploaded */
          <div className="w-full h-full flex flex-col items-center justify-center p-3 relative select-none">
            {/* Subtle decorative radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,139,79,0.1)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Stylized South Indian culinary emblem */}
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:border-emerald-500/40 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-emerald-400/80 group-hover:text-emerald-300 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mt-1.5 group-hover:text-gray-400 transition-colors">
              Pillaiyarappa
            </span>
          </div>
        )}

        {/* Top Badges Row */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          {/* Pure Veg Green Dot Badge */}
          <div
            className="w-4 h-4 rounded-xs border border-white/90 bg-black/70 backdrop-blur-md flex items-center justify-center shadow-md"
            title="100% Pure Vegetarian"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#168B4F] shadow-[0_0_5px_#168B4F]" />
          </div>

          <div className="flex items-center gap-1">
            {/* Bestseller Badge */}
            {item.isBestseller && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-1.5 py-0.5 text-[8.5px] font-black uppercase text-white tracking-wider shadow-md">
                <Flame className="w-2.5 h-2.5 fill-white" />
                <span>Bestseller</span>
              </span>
            )}

            {/* Price MRP Tag */}
            {item.priceType === 'mrp' && (
              <span className="rounded-md bg-black/75 backdrop-blur-md px-1 py-0.5 text-[7.5px] font-bold text-gray-300 uppercase tracking-widest border border-white/10">
                MRP
              </span>
            )}
          </div>
        </div>

        {/* Category tag pill on image bottom */}
        {categoryName && (
          <div className="absolute bottom-1.5 left-2 pointer-events-none z-10">
            <span className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-300/90 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10">
              {categoryName}
            </span>
          </div>
        )}

        {/* Sold out overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-red-500/90 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-lg">
              Sold Out Today
            </span>
          </div>
        )}
      </div>

      {/* 2. Content Info */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Name */}
          <h3 className="font-display font-black text-xs sm:text-[13.5px] text-white tracking-tight leading-snug line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {renderHighlighted(item.name)}
          </h3>

          {/* Description */}
          <p className="text-[10px] sm:text-[11px] text-gray-400/90 mt-0.5 line-clamp-1 leading-normal font-normal">
            {renderHighlighted(item.description)}
          </p>
        </div>

        {/* 3. Bottom Row: Price & Add/Qty Stepper */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between gap-1.5">
          {/* Indian Rupee Price */}
          <div className="flex flex-col">
            <span className="text-[8.5px] font-bold text-gray-500 uppercase tracking-wider">Price</span>
            <span className="font-display font-black text-xs sm:text-sm text-emerald-400 tracking-tight leading-none mt-0.5">
              ₹{item.price}
            </span>
          </div>

          {/* Cart Control: Add or Stepper */}
          {item.isAvailable ? (
            quantity === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${item.name} to cart`}
                className="interactive-press h-7 sm:h-7.5 px-3 sm:px-3.5 rounded-full bg-[#168B4F] hover:bg-[#127742] text-white font-display font-extrabold text-[11px] sm:text-xs tracking-wider flex items-center gap-1 shadow-[0_2px_10px_rgba(22,139,79,0.35)] hover:shadow-[0_4px_14px_rgba(22,139,79,0.55)] cursor-pointer active:scale-90 transition-all"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
                <span>ADD</span>
              </button>
            ) : (
              <div
                className="h-7 sm:h-7.5 px-1 rounded-full bg-emerald-950/90 border border-emerald-500/80 shadow-[0_3px_12px_rgba(22,139,79,0.3)] flex items-center gap-1"
                aria-label={`Quantity for ${item.name}: ${quantity}`}
              >
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Decrease quantity"
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#168B4F] hover:bg-emerald-600 active:scale-90 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <Minus className="w-2.5 h-2.5 stroke-[3]" />
                </button>

                <span className="font-display font-black text-[11px] sm:text-xs text-white px-1 min-w-[14px] text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleAdd}
                  aria-label="Increase quantity"
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#168B4F] hover:bg-emerald-600 active:scale-90 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </button>
              </div>
            )
          ) : (
            <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Pop-up detail card (Swiggy/Zomato bottom sheet on mobile, luxury modal on laptop) */}
    <ItemDetailModal
      item={item}
      isOpen={isDetailOpen}
      onClose={() => setIsDetailOpen(false)}
      categoryName={categoryName}
    />
  </>
  );
};

