import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem } from '../../types';
import { useCart } from '../../hooks/useCart';
import { triggerHaptic } from '../../utils/haptics';
import { playTikSound, playTukSound } from '../../utils/sound';
import { getCulinaryDetails } from '../../data/culinaryDetails';
import {
  X,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Leaf,
  Check,
  ShoppingBag,
  Clock,
  Maximize2,
  UtensilsCrossed,
} from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  categoryName,
}) => {
  const { getItemQuantity, addToCart, removeFromCart } = useCart();
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isLightboxOpen, onClose]);

  if (!isOpen || !item) return null;

  const quantity = getItemQuantity(item.id);
  const culinary = getCulinaryDetails(item, categoryName);

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

  const modalContent = (
    <>
      {/* Main Bottom Sheet / Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-detail-title"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* 
          Container:
          - Phone: Strictly HALF SCREEN (52vh), rounded-t-[32px], top border glow, drag indicator
          - Laptop: Centered luxury elevated rounded dialog (max-h-[85vh], max-w-xl)
        */}
        <div className="relative w-full sm:max-w-xl md:max-w-2xl rounded-t-[32px] sm:rounded-3xl bg-gradient-to-b from-[#131915] via-[#0d120f] to-[#090c0a] border-t-2 border-emerald-500/50 sm:border sm:border-emerald-500/35 shadow-[0_-25px_60px_rgba(0,0,0,0.98)] sm:shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(22,139,79,0.25)] text-white h-[52vh] max-h-[52vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-sheet-up sm:animate-modal-pop my-0 sm:my-auto">
          
          {/* Mobile Pull / Drag Indicator Pill */}
          <div className="sm:hidden w-full pt-2.5 pb-1 flex justify-center shrink-0">
            <div className="w-12 h-1 rounded-full bg-white/30" />
          </div>

          {/* Ambient Top Glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-500/20 blur-3xl rounded-full"
            aria-hidden="true"
          />

          {/* Floating Close Button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="interactive-press absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
            aria-label="Close dish details"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Scrollable Content Body (Leaves upper 48% of screen visible on phone!) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden p-4 sm:p-6 space-y-4">
            
            {/* 1. Full High-Resolution Dish Photo Showcase */}
            {item.image && item.image.trim() !== '' ? (
              <div
                className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1b221d] via-[#111613] to-[#0a0d0b] border border-white/10 shrink-0 ${
                  isPhotoExpanded ? 'aspect-auto max-h-[50vh]' : 'h-32 xs:h-36 sm:h-52'
                } flex items-center justify-center transition-all duration-300 group`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => setIsLightboxOpen(true)}
                  className={`w-full h-full ${
                    isPhotoExpanded ? 'object-contain' : 'object-cover sm:object-contain'
                  } transition-transform duration-500 cursor-pointer group-hover:scale-102`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* View Full Frame Photo Button (Opens 100% uncut view lightbox) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="interactive-press absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/25 text-[10px] sm:text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                  aria-label="View 100% full uncropped photo"
                >
                  <Maximize2 className="w-3 h-3 text-emerald-400" />
                  <span>Full Uncut Photo</span>
                </button>

                {/* Badges Over Image: Pure Veg Green Dot & Category */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                  <div className="w-4.5 h-4.5 rounded-xs border-1.5 border-emerald-400 bg-black/75 backdrop-blur-md flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 rounded-full bg-[#168B4F] shadow-xs" />
                  </div>

                  {item.isBestseller && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black shadow-md">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                      Bestseller
                    </span>
                  )}

                  {categoryName && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black/60 text-gray-200 backdrop-blur-md border border-white/10">
                      {categoryName}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* High-End Culinary Pattern when image is not present */
              <div className="h-28 sm:h-36 w-full rounded-2xl bg-gradient-to-br from-[#1b221d] via-[#111613] to-[#0a0d0b] border border-white/10 flex flex-col items-center justify-center p-4 text-center relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(22,139,79,0.3)] mb-1.5">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                  Pillaiyarappa Authentic Kitchen
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  100% Pure Vegetarian • Stone Ground Daily
                </span>
              </div>
            )}

            {/* 2. Item Details & Culinary Information */}
            <div className="space-y-4 pt-1">
              {/* Title, Category & Price Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
              <div className="space-y-1 flex-1">
                <h2
                  id="dish-detail-title"
                  className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-snug"
                >
                  {item.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="font-display font-black text-lg sm:text-xl text-emerald-400 tracking-wide">
                    ₹{item.price}
                  </span>
                  {culinary.portionSize && (
                    <span className="text-[11px] text-gray-400 font-medium">
                      • {culinary.portionSize}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300">
                    <Flame className="w-2.5 h-2.5 text-amber-400" />
                    {culinary.spiceLevel}
                  </span>
                </div>
              </div>

              {/* Direct Quantity Controls on Top Header */}
              <div className="shrink-0 pt-1">
                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="btn-shimmer interactive-press h-8 sm:h-9 px-4 rounded-full bg-[#168B4F] hover:bg-emerald-600 text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(22,139,79,0.4)] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ADD</span>
                  </button>
                ) : (
                  <div className="h-8 sm:h-9 px-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/80 shadow-[0_4px_16px_rgba(22,139,79,0.35)] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRemove}
                      aria-label="Decrease quantity"
                      className="w-6 h-6 rounded-full bg-[#168B4F] hover:bg-emerald-600 text-white flex items-center justify-center transition cursor-pointer active:scale-90"
                    >
                      <Minus className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="font-display font-black text-xs sm:text-sm text-white px-1 min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleAdd}
                      aria-label="Increase quantity"
                      className="w-6 h-6 rounded-full bg-[#168B4F] hover:bg-emerald-600 text-white flex items-center justify-center transition cursor-pointer active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Description &amp; Preparation</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {culinary.preparationNotes}
              </p>
            </div>

            {/* Key Authentic Ingredients Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Key Authentic Ingredients</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {culinary.ingredients.map((ing, idx) => (
                  <span
                    key={`ing-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-emerald-200/90 font-medium hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                    <span>{ing}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Accompaniments & Serving Info */}
            <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-3.5 sm:p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
                <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accompaniments Included</span>
              </div>
              <p className="text-xs sm:text-[13px] text-gray-200 leading-relaxed">
                {culinary.accompaniments}
              </p>
            </div>

            {/* Dietary & Wellness Highlights */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {culinary.dietaryHighlights.map((badge, idx) => (
                  <span
                    key={`diet-${idx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#168B4F]/15 text-emerald-300 border border-emerald-500/30"
                  >
                    <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>

              {culinary.energyTip && (
                <p className="text-[11px] text-gray-400 italic pt-1">
                  💡 {culinary.energyTip}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* 3. Bottom Sticky Bar: Total & Quick Add CTA */}
        <div className="shrink-0 p-3.5 sm:p-4 bg-[#0d120f]/95 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Item Price
            </span>
            <span className="font-display font-black text-lg sm:text-xl text-white">
              ₹{item.price}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {quantity > 0 ? (
              <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/70 rounded-full px-3 py-1.5 shadow-md">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="w-7 h-7 rounded-full bg-[#168B4F] hover:bg-emerald-600 text-white flex items-center justify-center transition active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="font-display font-black text-sm text-white min-w-[20px] text-center">
                  {quantity} in cart
                </span>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-7 h-7 rounded-full bg-[#168B4F] hover:bg-emerald-600 text-white flex items-center justify-center transition active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="btn-shimmer interactive-press inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#168B4F] via-[#1aa05b] to-[#127742] hover:brightness-110 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-display font-black uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(22,139,79,0.45)] transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-100" />
                <span>Add To Cart • ₹{item.price}</span>
              </button>
            )}
          </div>
        </div>

        </div>
      </div>

      {/* 4. Full-Screen Uncut High-Resolution Photo Lightbox */}
      {isLightboxOpen && item.image && item.image.trim() !== '' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} full uncut photo`}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar with Dish Name & Close Button */}
          <div className="w-full max-w-4xl flex items-center justify-between z-10 py-2">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-black text-sm sm:text-base text-white">
                {item.name}
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/35 px-2.5 py-0.5 rounded-full">
                100% Uncut Photo
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer transition active:scale-90"
              aria-label="Close full photo view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center 100% Full Uncut Dish Image (No Cropping) */}
          <div
            className="flex-1 w-full max-w-4xl flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.image}
              alt={item.name}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Bottom Caption Bar */}
          <div className="text-center z-10 py-2 text-xs text-gray-400">
            Pillaiyarappa Authentic South Indian Kitchen &bull; Served Fresh Daily
          </div>
        </div>
      )}
    </>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
