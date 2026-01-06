"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "snowx-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch {
                localStorage.removeItem(CART_STORAGE_KEY);
            }
        }
        setIsHydrated(true);
    }, []);

    // Save cart to localStorage when items change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isHydrated]);

    const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.id !== id));
        } else {
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, quantity } : i))
            );
        }
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
                isOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
