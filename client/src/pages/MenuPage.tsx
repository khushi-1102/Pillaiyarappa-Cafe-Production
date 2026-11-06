import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuCategory, MenuItem, MenuAddOn, SiteSettings } from '../types';
import { VineDivider } from '../components/brand/VineDivider';
import { Search, Flame, ShoppingBag, Check, AlertCircle, X, Sparkles, Tag, MessageCircle, PlusCircle } from 'lucide-react';
import { appStore } from '../services/store';
import { FoodCard } from '../components/menu/FoodCard';
import { triggerHaptic } from '../utils/haptics';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  DEFAULT_WHATSAPP_MESSAGES,
  isMobileDevice,
} from '../utils/whatsapp';

interface MenuPageProps {
  categories: MenuCategory[];
  items: MenuItem[];
  addons?: MenuAddOn[];
  settings: SiteSettings;
  onOpenOrderModal: () => void;
  initialCategorySlug?: string;
}

// Subtle staggered entry variants for menu items
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.15,
      ease: 'easeIn' as const,
    },
  },
};

// Popular ingredients and dishes for instant 1-click filtering
const POPULAR_INGREDIENT_SUGGESTIONS = [
  'Ghee',
  'Podi',
  'Potato Masala',
  'Paneer',
  'Coconut Chutney',
  'Sambar',
  'Rava',
  'Filter Coffee',
];

// Helper to highlight matching search query terms in text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-emerald-500 text-white font-bold px-0.5 rounded-xs"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export const MenuPage: React.FC<MenuPageProps> = ({
  categories,
  items,
  addons = [],
  settings,
  onOpenOrderModal,
  initialCategorySlug,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyBestsellers, setShowOnlyBestsellers] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync latest menu state from database on mount
  useEffect(() => {
    appStore.syncWithServer();
  }, []);

  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
    }
  }, [initialCategorySlug]);

  // Real-time filtering by name or description text matching
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      // 1. Category Filter (applied if selected and not 'all')
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && item.categoryId !== cat.id) {
          // If user searched for something, check if matches exist in this category
          return false;
        }
      }

      // 2. Bestseller Filter
      if (showOnlyBestsellers && !item.isBestseller) {
        return false;
      }

      // 3. Real-time Name or Description matching
      if (query) {
        const nameMatch = item.name.toLowerCase().includes(query);
        const descriptionMatch = item.description.toLowerCase().includes(query);

        // Also match individual terms if multi-word query
        const queryWords = query.split(/\s+/).filter(Boolean);
        const termsMatch = queryWords.length > 1 && queryWords.every(
          (word) =>
            item.name.toLowerCase().includes(word) ||
            item.description.toLowerCase().includes(word)
        );

        return nameMatch || descriptionMatch || termsMatch;
      }

      return true;
    });
  }, [items, categories, selectedCategory, showOnlyBestsellers, searchQuery]);

  // Total matches across all categories for search feedback
  const totalMatchesAcrossAllCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items.length;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    ).length;
  }, [items, searchQuery]);

  // Clear search input and restore focus
  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Toggle or set an ingredient suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    if (searchQuery.toLowerCase() === suggestion.toLowerCase()) {
      setSearchQuery('');
    } else {
      setSearchQuery(suggestion);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3 mb-6">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white">
            100% Pure Vegetarian Kitchen
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Authentic South Indian Menu
          </h1>
          <p className="text-sm text-emerald-400 font-bold max-w-lg mx-auto">
            {settings.deliveryOfferText}
          </p>
        </div>

        <VineDivider className="mb-6" />

        {/* Real-Time Search & Filter Toolbar with Glassmorphism */}
        <div className="rounded-3xl glass-panel p-5 sm:p-6 mb-8 shadow-2xl space-y-4 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Real-Time Search Input with Quick Clear Button */}
            <div className="relative w-full md:flex-1 max-w-xl">
              <label htmlFor="menu-search-input" className="sr-only">
                Search menu items by name or description
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-3.5 w-4 h-4 text-emerald-400"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="menu-search-input"
                  name="search"
                  type="text"
                  placeholder="Search menu items by name or description (e.g. Dosa, Idli, Podi, Potato)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl glass-input pl-11 pr-11 py-3 text-sm text-white placeholder-gray-400 focus:outline-none transition-all"
                  autoComplete="off"
                  aria-label="Search menu items by name or description"
                  data-testid="menu-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3.5 top-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
                    title="Clear search query"
                    aria-label="Clear search query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filter: Bestsellers toggle & Order Online */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setShowOnlyBestsellers(!showOnlyBestsellers)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  showOnlyBestsellers
                    ? 'bg-[#E23744] text-white border-[#E23744] shadow-[0_0_15px_rgba(226,55,68,0.4)] scale-102'
                    : 'glass-pill text-gray-300 hover:text-white'
                }`}
                aria-pressed={showOnlyBestsellers}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Bestsellers Only</span>
              </button>

              <button
                onClick={onOpenOrderModal}
                className="btn-shimmer rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black uppercase text-white hover:bg-emerald-600 transition shadow-[0_4px_16px_rgba(22,139,79,0.35)] active:scale-95"
              >
                Order Online
              </button>
            </div>
          </div>

          {/* Quick Ingredient / Dish Filter Suggestions */}
          <div className="pt-2 border-t border-[#1C1C1C] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 shrink-0">
              <Tag className="w-3 h-3 text-emerald-400" />
              Quick search:
            </span>
            {POPULAR_INGREDIENT_SUGGESTIONS.map((suggestion) => {
              const isSelected =
                searchQuery.toLowerCase() === suggestion.toLowerCase();
              return (
                <button
                  key={suggestion}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    isSelected
                      ? 'bg-emerald-500 text-white font-bold shadow-xs'
                      : 'bg-[#1C1C1C] text-gray-300 hover:text-white hover:bg-neutral-800 border border-[#2E2E2E]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {suggestion}
                </button>
              );
            })}
          </div>

          {/* Search Result Feedback Indicator */}
          {searchQuery.trim() && (
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="text-white">{filteredItems.length}</strong> dish
                  {filteredItems.length === 1 ? '' : 'es'} matching "
                  <span className="text-emerald-400 font-semibold">{searchQuery.trim()}</span>"
                </span>
                {selectedCategory !== 'all' && totalMatchesAcrossAllCategories > filteredItems.length && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    (View all {totalMatchesAcrossAllCategories} matches in other categories)
                  </button>
                )}
              </div>
              <button
                onClick={handleClearSearch}
                className="text-xs text-gray-400 hover:text-white underline ml-auto"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Sticky Category Tabs with Solid Background & Frosted Backdrop to prevent text bleed */}
        <div className="sticky top-16 sm:top-20 z-30 bg-[#090909]/95 backdrop-blur-xl border-b border-white/10 py-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar shadow-lg">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
            <button
              onClick={() => {
                triggerHaptic('selection');
                setSelectedCategory('all');
              }}
              className={`interactive-press px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'glass-pill-active text-white'
                  : 'glass-pill text-gray-300 hover:text-white'
              }`}
              aria-pressed={selectedCategory === 'all'}
            >
              All Categories ({items.length})
            </button>

            {categories.map((cat) => {
              const count = items.filter((i) => i.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedCategory(cat.slug);
                  }}
                  className={`interactive-press px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'glass-pill-active text-white'
                      : 'glass-pill text-gray-300 hover:text-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Add-Ons & Accompaniments Showcase (Horizontal Swipe on Mobile, Grid on Desktop) */}
        {addons && addons.length > 0 && (
          <div className="rounded-2xl glass-panel p-3.5 sm:p-5 mb-6 sm:mb-8 border border-emerald-500/30 bg-emerald-950/20 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2.5 sm:mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <h2 className="font-display font-black text-xs sm:text-sm uppercase text-white tracking-wide">
                  Customise With Add-Ons &amp; Extras
                </h2>
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold">
                Available with Dosas, Uttapams, Idlis &amp; Meals
              </span>
            </div>

            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="rounded-xl bg-[#141414] border border-white/10 p-2.5 sm:p-3 flex flex-col justify-between hover:border-emerald-500/50 transition-colors shadow-xs shrink-0 w-36 sm:w-auto"
                >
                  <span className="text-xs font-bold text-white line-clamp-1">{addon.name}</span>
                  <div className="flex items-center justify-between mt-1.5 sm:mt-2 pt-1 border-t border-white/5">
                    <span className="text-[10px] text-gray-400">Add-on</span>
                    <span className="font-display font-black text-xs text-emerald-400">+₹{addon.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl glass-panel p-10 sm:p-14 text-center space-y-4 shadow-2xl border border-white/10">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_15px_rgba(22,139,79,0.3)]">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">
                No Dishes Matching Your Search
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No menu items found for "
                <span className="text-emerald-400 font-semibold">{searchQuery}</span>
                "{selectedCategory !== 'all' ? ` in the selected category` : ''}.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowOnlyBestsellers(false);
                }}
                className="btn-shimmer rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black uppercase text-white hover:bg-emerald-600 transition shadow-[0_4px_16px_rgba(22,139,79,0.35)]"
              >
                Reset All Filters
              </button>
              <button
                onClick={handleClearSearch}
                className="glass-pill rounded-xl px-5 py-2.5 text-xs font-semibold text-gray-300 hover:text-white transition"
              >
                Clear Search Text
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <FoodCard
                  key={item.id}
                  item={item}
                  searchQuery={searchQuery}
                  categoryName={category?.name}
                />
              );
            })}
          </div>
        )}

        {/* Bottom Home Delivery Reminder banner */}
        <div className="mt-12 rounded-2xl bg-[#1B1B1B] border border-emerald-500/40 p-6 text-center space-y-3 shadow-xl">
          <h2 className="font-display font-black text-xl text-white uppercase">
            Order Your Favourite South Indian Dishes Now
          </h2>
          <p className="text-xs text-gray-300 max-w-lg mx-auto">
            Direct rider delivery available within 3 km radius (Min. order ₹500) • City-wide delivery across Gurugram on Zomato &amp; Swiggy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={onOpenOrderModal}
              className="rounded-full bg-emerald-500 px-6 py-2.5 font-display font-black text-xs uppercase text-white hover:bg-emerald-400 transition"
            >
              Order on Zomato &amp; Swiggy
            </button>
            <a
              href={getSmartWhatsAppUrl(settings.whatsappNumber, DEFAULT_WHATSAPP_MESSAGES.menu)}
              onClick={(e) =>
                handleWhatsAppLinkClick(e, settings.whatsappNumber, DEFAULT_WHATSAPP_MESSAGES.menu)
              }
              target={isMobileDevice() ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="rounded-full bg-[#168B4F] hover:bg-[#127742] px-5 py-2 text-xs font-bold uppercase text-white flex items-center gap-1.5 shadow-[0_4px_14px_rgba(22,139,79,0.3)] transition"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Order</span>
            </a>
            <a
              href={`tel:+91${settings.phonePrimary}`}
              className="rounded-full border border-emerald-500/40 px-5 py-2 text-xs font-bold uppercase text-white hover:bg-emerald-500 hover:text-white transition"
            >
              Call 9899101195
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
