'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
    const { items, remove, updateQty, total, clear } = useCart();

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 text-2xl"
                    style={{ background: 'var(--wire)' }}
                >
                    🛒
                </div>
                <p
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
                >
                    Your cart is empty
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
                    Browse the catalog and add something worth carrying.
                </p>
                <Link
                    href="/"
                    className="text-sm px-5 py-2.5 rounded-lg text-white inline-block"
                    style={{ background: 'var(--signal)' }}
                >
                    Back to catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <div className="flex items-baseline justify-between mb-8">
                <h1
                    className="text-2xl font-semibold"
                    style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
                >
                    Cart
                </h1>
                <button
                    onClick={clear}
                    className="text-xs"
                    style={{ color: 'var(--slate)' }}
                >
                    Clear all
                </button>
            </div>

            {/* Line items */}
            <div className="space-y-3 mb-8">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl"
                        style={{ background: 'white', border: '1px solid var(--wire)' }}
                    >
                        {/* Icon placeholder */}
                        <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                            style={{ background: 'var(--wire)' }}
                        >
                            ⚡
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>
                                {item.name}
                            </p>
                            <p
                                className="text-xs mt-0.5"
                                style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}
                            >
                                {item.price.toFixed(2)} USD
                            </p>
                        </div>

                        {/* Quantity stepper */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-md text-sm font-medium flex items-center justify-center"
                                style={{ background: 'var(--wire)', color: 'var(--ink)' }}
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span
                                className="w-5 text-center text-sm"
                                style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--ink)' }}
                            >
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-md text-sm font-medium flex items-center justify-center"
                                style={{ background: 'var(--wire)', color: 'var(--ink)' }}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        {/* Line total — hidden on very small screens to prevent overflow */}
                        <span
                            className="hidden sm:inline text-sm font-medium w-16 text-right flex-shrink-0"
                            style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--ink)' }}
                        >
                            {(item.price * item.quantity).toFixed(2)}
                        </span>

                        {/* Remove */}
                        <button
                            onClick={() => remove(item.id)}
                            className="text-lg flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity"
                            aria-label="Remove item"
                            style={{ color: 'var(--slate)' }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Total + CTA */}
            <div
                className="px-5 py-4 rounded-xl"
                style={{ background: 'white', border: '1px solid var(--wire)' }}
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm" style={{ color: 'var(--slate)' }}>
                        Total ({items.length} {items.length === 1 ? 'item' : 'items'})
                    </span>
                    <span
                        className="text-2xl font-medium"
                        style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}
                    >
                        {total.toFixed(2)}{' '}
                        <span className="text-sm font-normal" style={{ color: 'var(--slate)' }}>USD</span>
                    </span>
                </div>
                <Link
                    href="/checkout"
                    className="block w-full py-3 rounded-lg text-sm font-medium text-white text-center"
                    style={{ background: 'var(--signal)' }}
                >
                    Proceed to checkout
                </Link>
            </div>
        </div>
    );
}
