'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { gql } from '../../lib/gql';
import { Product } from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';

const GET_PRODUCT = `
  query GetProduct($id: ID!) {
    getProduct(id: $id) { id name description price }
  }
`;

interface ProductResult { getProduct: Product }

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { add, items } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [status, setStatus] = useState<'loading' | 'ok' | 'error' | 'notfound'>('loading');
    const [added, setAdded] = useState(false);

    useEffect(() => {
        gql<ProductResult>(GET_PRODUCT, { id })
            .then((data) => {
                if (!data.getProduct) { setStatus('notfound'); return; }
                setProduct(data.getProduct);
                setStatus('ok');
            })
            .catch(() => setStatus('error'));
    }, [id]);

    const handleAdd = () => {
        if (!product) return;
        add(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const inCart = items.find((i) => i.id === id);

    if (status === 'loading') {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 animate-pulse">
                <div className="rounded-xl h-80" style={{ background: 'var(--wire)' }} />
                <div className="space-y-4 pt-2">
                    <div className="h-5 rounded w-3/4" style={{ background: 'var(--wire)' }} />
                    <div className="h-4 rounded w-full" style={{ background: 'var(--wire)' }} />
                    <div className="h-4 rounded w-5/6" style={{ background: 'var(--wire)' }} />
                    <div className="h-8 rounded w-1/3 mt-4" style={{ background: 'var(--wire)' }} />
                    <div className="h-10 rounded w-full mt-4" style={{ background: 'var(--wire)' }} />
                </div>
            </div>
        );
    }

    if (status === 'notfound') {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <p className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-space), system-ui' }}>
                    Product not found
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
                    This item may have been removed.
                </p>
                <Link href="/" className="text-sm px-5 py-2 rounded-lg text-white" style={{ background: 'var(--signal)' }}>
                    Back to catalog
                </Link>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>Could not load product.</p>
                <button onClick={() => router.back()} className="text-sm" style={{ color: 'var(--signal)' }}>
                    ← Go back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <Link href="/" className="text-xs mb-8 inline-block" style={{ color: 'var(--slate)' }}>
                ← Back to catalog
            </Link>

            <div className="grid md:grid-cols-2 gap-10 mt-4">
                {/* Image */}
                <div
                    className="rounded-xl h-80 flex items-center justify-center text-6xl"
                    style={{ background: 'var(--wire)' }}
                >
                    ⚡
                </div>

                {/* Details — sticky on desktop */}
                <div className="md:sticky md:top-24 self-start">
                    <h1
                        className="text-2xl font-semibold mb-3 leading-snug"
                        style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
                    >
                        {product!.name}
                    </h1>

                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--slate)' }}>
                        {product!.description}
                    </p>

                    {/* Signature price */}
                    <div className="mb-6">
                        <span
                            className="text-3xl font-medium"
                            style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}
                        >
                            {product!.price.toFixed(2)}
                        </span>
                        <span className="text-sm ml-2" style={{ color: 'var(--slate)' }}>USD</span>
                    </div>

                    {/* Stock indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--confirm)' }} />
                        <span className="text-xs" style={{ color: 'var(--slate)' }}>In stock</span>
                        {inCart && (
                            <span className="text-xs ml-2" style={{ color: 'var(--slate)' }}>
                                · {inCart.quantity} in cart
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAdd}
                        className="w-full py-3 rounded-lg text-sm font-medium text-white transition-all"
                        style={{
                            background: added ? 'var(--confirm)' : 'var(--signal)',
                        }}
                    >
                        {added ? '✓ Added to cart' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
