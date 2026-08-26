'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '../components/ProductCard';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextValue {
    items: CartItem[];
    add: (product: Product) => void;
    remove: (id: string) => void;
    updateQty: (id: string, quantity: number) => void;
    clear: () => void;
    count: number;
    total: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const LS_KEY = 'voltline_cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LS_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch {
            localStorage.removeItem(LS_KEY);
        }
    }, []);

    const persist = (next: CartItem[]) => {
        setItems(next);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
    };

    const add = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            const next = existing
                ? prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
                : [...prev, { ...product, quantity: 1 }];
            localStorage.setItem(LS_KEY, JSON.stringify(next));
            return next;
        });
    };

    const remove = (id: string) => persist(items.filter((i) => i.id !== id));

    const updateQty = (id: string, quantity: number) => {
        if (quantity < 1) { remove(id); return; }
        persist(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
    };

    const clear = () => persist([]);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, add, remove, updateQty, clear, count, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
