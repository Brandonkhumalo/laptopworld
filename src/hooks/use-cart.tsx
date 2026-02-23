import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface CartProduct {
  id: number;
  name: string;
  price: string;
  image: string | null;
  deal_price: string | null;
  category_name: string;
}

interface CartItemType {
  id: number;
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItemType[];
  cartCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  cartCount: 0,
  loading: false,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  refreshCart: async () => {},
  getTotal: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.cart.get();
      setItems(data.items || []);
      if (data.session_key) {
        localStorage.setItem('cart_session', data.session_key);
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    setLoading(true);
    try {
      const data = await api.cart.add(productId, quantity);
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setLoading(true);
    try {
      const data = await api.cart.update(itemId, quantity);
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    setLoading(true);
    try {
      const data = await api.cart.remove(itemId);
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const price = item.product.deal_price ? parseFloat(item.product.deal_price) : parseFloat(item.product.price);
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ items, cartCount, loading, addToCart, updateQuantity, removeFromCart, refreshCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
