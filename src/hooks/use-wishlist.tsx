import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  deal_price: string | null;
  image: string | null;
  category_name: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const isInWishlist = useCallback((productId: number) => {
    return items.some(item => item.id === productId);
  }, [items]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider value={{ items, wishlistCount: items.length, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
