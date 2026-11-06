import React, { useState, useMemo } from 'react';
import { MenuCategory, MenuItem } from '../../types';
import { FoodCard } from '../menu/FoodCard';
import { appStore } from '../../services/store';
import { triggerHaptic } from '../../utils/haptics';
import { Search, X, Sparkles, ChevronRight, UtensilsCrossed, ArrowRight } from 'lucide-react';

interface CategoryCardsProps {
  categories: MenuCategory[];
  items?: MenuItem[];
  onSelectCategory?: (slug: string) => void;
  onNavigateToMenu?: () => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  categories,
  items,
  onSelectCategory,
  onNavigateToMenu,
}) => {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fallback to store items if not passed
  const allItems = useMemo(() => {
    if (items && items.length > 0) return items;
    return appStore.getMenuItems();
  }, [items]);

  // Handle category tab change with mobile haptics
  const handleCategoryChange = (slug: string) => {
    triggerHaptic('selection');
    setSelectedCategorySlug(slug);
    if (onSelectCategory && slug !== 'all') {
      // Optional callback
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    let result = allItems;

    // Filter by category
    if (selectedCategorySlug !== 'all') {
      const activeCat = categories.find((c) => c.slug === selectedCategorySlug);
      if (activeCat) {
        result = result.filter((item) => item.categoryId === activeCat.id);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allItems, categories, selectedCategorySlug, searchQuery]);

  // Limit display to 6 items on home page preview, prioritizing photos & bestsellers
  const displayedItems = useMemo(() => {
    let list = [...filteredItems];
    if (selectedCategorySlug === 'all' && !searchQuery.trim()) {
      list.sort((a, b) => {
        const aHasImg = a.image && a.image.trim() !== '' ? 1 : 0;
        const bHasImg = b.image && b.image.trim() !== '' ? 1 : 0;
        if (bHasImg !== aHasImg) return bHasImg - aHasImg;
        const aBest = a.isBestseller ? 1 : 0;
        const bBest = b.isBestseller ? 1 : 0;
        if (bBest !== aBest) return bBest - aBest;
        return a.sortOrder - b.sortOrder;
      });
    }
    return list.slice(0, 6);
  }, [filteredItems, selectedCategorySlug, searchQuery]);

  return (
    <section id="menu-section" className="py-8 sm:py-14 bg-[#090909] relative">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* 1. Header with Title & Brand Promise */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Authentic South Indian Recipes</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                Our Menu
              </h2>
              <div
                className="h-2 w-12 sm:w-16 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-[0_0_12px_rgba(22,139,79,0.6)]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline-block">
              Free In-House Delivery (Within 3 km Radius) • Min. Order ₹500
            </span>
            {onNavigateToMenu && (
              <button
                type="button"
                onClick={onNavigateToMenu}
                className="interactive-press text-xs font-bold text-white hover:text-emerald-300 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition border border-white/10 hover:border-emerald-500/40 cursor-pointer"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Interactive Search Bar */}
        <div className="relative mb-5 sm:mb-6">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Masala Dosa, Ghee Podi Idli, Filter Coffee...)"
              className="w-full rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 focus:border-emerald-500 pl-11 pr-10 py-3 sm:py-3.5 text-sm text-white placeholder-gray-500 shadow-inner focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSearchQuery('');
                }}
                aria-label="Clear search text"
                className="absolute right-3.5 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Horizontal Category Filter Pills (Mobile Swipeable, Sticky-friendly) */}
        <div className="mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none pb-2 pt-1">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
            {/* "All" Tab */}
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`interactive-press px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategorySlug === 'all'
                  ? 'bg-[#168B4F] text-white shadow-[0_4px_16px_rgba(22,139,79,0.45)] border border-emerald-400/30 scale-[1.02]'
                  : 'bg-[#141414] text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              All Items ({allItems.length})
            </button>

            {/* Category Tabs */}
            {categories.map((cat) => {
              const isSelected = selectedCategorySlug === cat.slug;
              const count = allItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`interactive-press px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#168B4F] text-white shadow-[0_4px_16px_rgba(22,139,79,0.45)] border border-emerald-400/30 scale-[1.02]'
                      : 'bg-[#141414] text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Ultra-Premium Food Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl bg-[#121212] border border-white/10 p-8 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">No Dishes Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No menu items match "{searchQuery}" in this category. Try clearing your search or browsing another category.
            </p>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setSearchQuery('');
                setSelectedCategorySlug('all');
              }}
              className="mt-2 rounded-full bg-[#168B4F] px-4 py-2 text-xs font-bold text-white uppercase hover:bg-emerald-600 transition"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {displayedItems.map((item) => {
                const cat = categories.find((c) => c.id === item.categoryId);
                return (
                  <FoodCard
                    key={item.id}
                    item={item}
                    searchQuery={searchQuery}
                    categoryName={cat?.name}
                  />
                );
              })}
            </div>

            {/* 5. Prominent "View Full Menu" Call To Action */}
            {onNavigateToMenu && (
              <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center text-center space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    if (selectedCategorySlug !== 'all' && onSelectCategory) {
                      onSelectCategory(selectedCategorySlug);
                    } else {
                      onNavigateToMenu();
                    }
                  }}
                  className="interactive-press group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#168B4F] via-emerald-600 to-[#168B4F] hover:from-emerald-500 hover:to-emerald-400 px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-display font-black uppercase tracking-wider text-white shadow-[0_8px_28px_rgba(22,139,79,0.4)] hover:shadow-[0_12px_36px_rgba(22,139,79,0.6)] transition-all cursor-pointer border border-emerald-400/40 active:scale-95"
                >
                  <UtensilsCrossed className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform duration-300" />
                  <span>View Full Menu</span>
                  <span className="hidden xs:inline-block px-2.5 py-0.5 rounded-full bg-black/30 text-[10px] sm:text-xs text-emerald-200 font-bold border border-white/10">
                    {allItems.length}+ Items
                  </span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium">
                  Showing 6 popular items &bull; Click to explore our full {allItems.length}+ authentic dishes &amp; add-ons
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};
