import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { playTikSound, playTukSound } from '../utils/sound';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  cart: Record<string, CartItem>;
  itemsList: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  totalCount: number;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  generateWhatsAppOrderMessage: (
    notes?: string,
    deliveryAddress?: string,
    deliveryInfo?: string,
    mapsUrl?: string
  ) => string;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'pillaiyarappa_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Record<string, CartItem>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const itemsList = Object.values(cart);

  const totalCount = itemsList.reduce((sum, entry) => sum + entry.quantity, 0);

  const totalAmount = itemsList.reduce(
    (sum, entry) => sum + (entry.item.price || 0) * entry.quantity,
    0
  );

  const getItemQuantity = (itemId: string): number => {
    return cart[itemId]?.quantity || 0;
  };

  const addToCart = (item: MenuItem) => {
    triggerHaptic('medium');
    playTikSound();
    setCart((prev) => {
      const existing = prev[item.id];
      const newQty = existing ? existing.quantity + 1 : 1;
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: newQty,
        },
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    triggerHaptic('light');
    playTukSound();
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    triggerHaptic(delta > 0 ? 'medium' : 'light');
    if (delta > 0) {
      playTikSound();
    } else {
      playTukSound();
    }
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: newQty,
        },
      };
    });
  };

  const clearCart = () => {
    triggerHaptic('warning');
    setCart({});
  };

  const openCartDrawer = () => {
    triggerHaptic('selection');
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const generateWhatsAppOrderMessage = (
    notes?: string,
    deliveryAddress?: string,
    deliveryInfo?: string,
    mapsUrl?: string
  ): string => {
    if (itemsList.length === 0) return '';

    const lines = [
      '🍽️ *ORDER — PILLAIYARAPPA SOUTH INDIAN CORNER*',
      '--------------------------------',
    ];

    itemsList.forEach((entry, idx) => {
      const itemTotal = (entry.item.price || 0) * entry.quantity;
      lines.push(`${idx + 1}. *${entry.item.name}* x ${entry.quantity} = ₹${itemTotal}`);
    });

    lines.push('--------------------------------');
    lines.push(`💰 *Item Total: ₹${totalAmount}*`);
    if (totalAmount >= 500) {
      lines.push('🛵 *In-House Delivery: FREE* (Orders ₹500+ within 3 km radius)');
    } else {
      lines.push('🛵 *In-House Delivery: Standard charges apply* (Free on orders ₹500+ within 3 km)');
    }

    if (deliveryAddress && deliveryAddress.trim()) {
      lines.push(`📍 *Delivery Address:* ${deliveryAddress.trim()}`);
    }

    if (mapsUrl && mapsUrl.trim()) {
      lines.push(`🎯 *Exact Live GPS Pin:* ${mapsUrl.trim()}`);
    }

    if (deliveryInfo && deliveryInfo.trim()) {
      lines.push(`📏 *Delivery Zone Check:* ${deliveryInfo.trim()}`);
    }

    if (notes && notes.trim()) {
      lines.push(`📝 *Cooking Instructions:* ${notes.trim()}`);
    }

    lines.push('--------------------------------');
    lines.push('Please confirm my order and share estimated prep & delivery time. Thank you!');

    return lines.join('\n');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemsList,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalCount,
        totalAmount,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        generateWhatsAppOrderMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
