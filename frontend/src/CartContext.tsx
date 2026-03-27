import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a Cart Item
interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: any) => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bookID === book.bookID);
      if (existingItem) {
        // Update quantity if book is already in cart 
        return prevCart.map((item) =>
          item.bookID === book.bookID ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Add new book with initial quantity of 1 [cite: 4]
      return [...prevCart, { bookID: book.bookID, title: book.title, price: book.price, quantity: 1 }];
    });
  };

  // Calculate totals for the Cart Summary [cite: 5, 8]
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};