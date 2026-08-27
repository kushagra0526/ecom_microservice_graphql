'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const LS_KEY = 'voltline_cart';

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LS_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch {
            localStorage.removeItem(LS_KEY);
        }
    }, []);

    const persist = (next) => {
        setItems(next);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
    };

    const add = (product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            const next = existing
                ? prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
                : [...prev, { ...product, quantity: 1 }];
            localStorage.setItem(LS_KEY, JSON.stringify(next));
            return next;
        });
    };

    const remove = (id) => persist(items.filter((i) => i.id !== id));

    const updateQty = (id, quantity) => {
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
