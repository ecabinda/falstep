import { getAssetPath } from "../utils/assets";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const sanitizeCartItem = (i) => {
  const price = Number(i.price) || 65;
  const qty = Number(i.qty || i.quantity) || 1;
  const size = i.size || i.selectedSize || "L";
  return {
    id: i.id || "item",
    title: i.title || "Peça FALSTEP",
    size: size,
    selectedSize: size,
    color: i.color || "DEFAULT",
    price: price,
    qty: qty,
    quantity: qty,
    image: getAssetPath(i.image || "/images/products/hero_david_feroz_black.jpg")
  };
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("atelier_cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(sanitizeCartItem);
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("atelier_cart", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addItem = (product, size = "L", qty = 1) => {
    const validPrice = Number(product.price) || 0;
    const validQty = Number(qty) || 1;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && (i.size === size || i.selectedSize === size));
      if (idx > -1) {
        const next = [...prev];
        const nextQty = (Number(next[idx].qty || next[idx].quantity) || 1) + validQty;
        next[idx] = {
          ...next[idx],
          qty: nextQty,
          quantity: nextQty,
          size: size,
          selectedSize: size,
          price: validPrice || next[idx].price || 0,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          size: size,
          selectedSize: size,
          color: product.color || "DEFAULT",
          price: validPrice,
          qty: validQty,
          quantity: validQty,
          image: product.image || (product.gallery && product.gallery[0]) || ""
        }
      ];
    });
  };

  const removeItem = (id, size) => {
    setItems((prev) =>
      prev.filter((i) => {
        const itemSize = i.size || i.selectedSize;
        return !(i.id === id && itemSize === size);
      })
    );
  };

  const updateQty = (id, size, delta) => {
    setItems((prev) =>
      prev
        .map((i) => {
          const itemSize = i.size || i.selectedSize;
          if (i.id === id && itemSize === size) {
            const currentQty = Number(i.qty || i.quantity || 1);
            const nextQty = currentQty + delta;
            return nextQty > 0 ? { ...i, qty: nextQty, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, i) => sum + (Number(i.qty || i.quantity) || 1), 0);
  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty || i.quantity) || 1), 0);
  const freeShippingThreshold = 150.00;
  const shippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalCount,
        subtotal,
        shippingPercent,
        shippingRemaining,
        freeShippingThreshold
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
