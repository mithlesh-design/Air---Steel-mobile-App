import React, { createContext, useContext, useState } from 'react';

export type CartItem = {
  id: string;
  title: string;
  vol: string;
  format: string;
  price: number;
  img: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart: (item) =>
          setCartItems((prev) =>
            prev.some((i) => i.id === item.id) ? prev : [...prev, item]
          ),
        removeFromCart: (id) =>
          setCartItems((prev) => prev.filter((i) => i.id !== id)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
