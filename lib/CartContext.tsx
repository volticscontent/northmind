"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/data-loader";
import { trackAddToCart } from "@/lib/tracking";

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  decreaseQuantity: (productId: string, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage only after component mounts
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("nm-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage only when it changes AND after initial mount
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("nm-cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    
    // Tracking
    trackAddToCart(product, 1);
    
    setIsDrawerOpen(true);
  };

  const decreaseQuantity = (productId: string, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId && item.selectedSize === size);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === productId && item.selectedSize === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => !(item.id === productId && item.selectedSize === size));
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, decreaseQuantity, removeFromCart, clearCart, 
      totalItems, totalPrice, isDrawerOpen, setIsDrawerOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
