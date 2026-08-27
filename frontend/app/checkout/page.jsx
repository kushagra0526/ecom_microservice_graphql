'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { gql } from '../lib/gql';

const CREATE_ORDER = `
  mutation CreateOrder($productId: ID!, $userId: ID!, $quantity: Int!) {
    createOrder(productId: $productId, userId: $userId, quantity: $quantity) {
      id productId quantity status
    }
  }
`;

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, total, clear } = useCart();
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState([]);
    const [placed, setPlaced] = useState([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (user === null) router.replace('/auth/login?returnTo=/checkout');
    }, [user, router]);

    useEffect(() => {
        if (items.length === 0 && !done) router.replace('/cart');
    }, [items, done, router]);

    if (!user) return null;

    const handlePlaceOrder = async () => {
        setSubmitting(true);
        setErrors([]);
        const results = [];
        const failed = [];

        for (const item of items) {
            try {
                const data = await gql(CREATE_ORDER, { productId: item.id, userId: user.userId, quantity: item.quantity }, user.token);
                results.push({ id: data.createOrder.id, productName: item.name, quantity: item.quantity, price: item.price, status: data.createOrder.status });
            } catch (err) {
                failed.push({ name: item.name, message: err.message || 'Order failed' });
            }
        }

        setSubmitting(false);

        if (failed.length > 0) {
            setErrors(failed);
            if (results.length > 0) { setPlaced(results); setDone(true); clear(); }
            return;
        }

        setPlaced(results);
        setDone(true);
        clear();
    };

    if (done && placed.length > 0) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 text-2xl"
                    style={{ background: '#D1FAE5' }}>✓</div>
                <h1 className="text-2xl font-semibold mb-2"
                    style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}>Order placed</h1>
                <p className="text-sm mb-8" style={{ color: 'var(--slate)' }}>
                    {placed.length} {placed.length === 1 ? 'item' : 'items'} confirmed. We&apos;ll get it moving.
                </p>

                <div className="space-y-2 mb-8 text-left">
                    {placed.map((o) => (
                        <div key={o.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                            style={{ background: 'white', border: '1px solid var(--wire)' }}>
                            <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{o.productName}</p>
                                <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--slate)' }}>
                                    #{o.id}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#D1FAE5', color: '#065F46' }}>
                                    {o.status}
                                </span>
                                <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}>
                                    {(o.price * o.quantity).toFixed(2)} USD
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {errors.length > 0 && (
                    <div className="text-sm px-4 py-3 rounded-lg mb-6 text-left"
                        style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}>
                        <p className="font-medium mb-1">Some items could not be ordered:</p>
                        {errors.map((e) => <p key={e.name} className="text-xs">• {e.name}: {e.message}</p>)}
                    </div>
                )}

                <Link href="/" className="text-sm px-5 py-2.5 rounded-lg text-white inline-block"
                    style={{ background: 'var(--signal)' }}>Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-semibold mb-8"
                style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}>Checkout</h1>

            <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--wire)' }}>
                <div className="px-4 py-3" style={{ background: 'var(--wire)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--slate)' }}>
                        ORDER SUMMARY — {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
                    </p>
                </div>
                <div className="divide-y" style={{ background: 'white' }}>
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-3">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--ink)' }}>{item.name}</p>
                                <p className="text-xs" style={{ color: 'var(--slate)' }}>Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-medium"
                                style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}>
                                {(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Total</span>
                        <span className="text-xl font-medium"
                            style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}>
                            {total.toFixed(2)}{' '}
                            <span className="text-xs font-normal" style={{ color: 'var(--slate)' }}>USD</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
                style={{ background: 'white', border: '1px solid var(--wire)' }}>
                <span className="text-lg">👤</span>
                <div>
                    <p className="text-xs" style={{ color: 'var(--slate)' }}>Ordering as</p>
                    <p className="text-sm" style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--ink)' }}>
                        {user.userId}
                    </p>
                </div>
            </div>

            {errors.length > 0 && (
                <div className="text-sm px-4 py-3 rounded-lg mb-5"
                    style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
                    {errors.map((e) => <p key={e.name}>• <strong>{e.name}</strong>: {e.message}</p>)}
                </div>
            )}

            <button onClick={handlePlaceOrder} disabled={submitting}
                className="w-full py-3 rounded-lg text-sm font-medium text-white transition-opacity"
                style={{ background: 'var(--signal)', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Placing orders…' : `Place order · ${total.toFixed(2)} USD`}
            </button>

            <p className="text-xs text-center mt-3" style={{ color: 'var(--slate)' }}>
                <Link href="/cart" style={{ color: 'var(--signal)' }}>← Edit cart</Link>
            </p>
        </div>
    );
}
