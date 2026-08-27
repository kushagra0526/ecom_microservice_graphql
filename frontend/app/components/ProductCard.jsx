'use client';

import Link from 'next/link';

export default function ProductCard({ product, onAddToCart }) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="group block relative rounded-xl overflow-hidden"
            style={{ background: 'white', border: '1px solid var(--wire)' }}
        >
            {/* Image area */}
            <div
                className="w-full h-44 flex items-center justify-center select-none"
                style={{ background: 'var(--wire)' }}
            >
                <span className="text-4xl opacity-30">⚡</span>
            </div>

            {/* Info */}
            <div className="px-4 pt-3 pb-12">
                <p
                    className="text-sm font-medium leading-snug line-clamp-2"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-space), system-ui' }}
                >
                    {product.name}
                </p>
                <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--slate)' }}>
                    {product.description}
                </p>

                {/* Signature: monospace price in signal blue */}
                <p
                    className="mt-2 text-base font-medium"
                    style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)', letterSpacing: '-0.01em' }}
                >
                    {product.price.toFixed(2)}{' '}
                    <span className="text-xs font-normal" style={{ color: 'var(--slate)' }}>USD</span>
                </p>
            </div>

            {/* Slide-up Add to Cart strip */}
            <button
                onClick={(e) => { e.preventDefault(); onAddToCart?.(product); }}
                className="card-strip absolute bottom-0 left-0 right-0 py-2.5 text-xs font-medium text-white text-center translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out"
                style={{ background: 'var(--signal)' }}
                aria-label={`Add ${product.name} to cart`}
            >
                Add to cart
            </button>
        </Link>
    );
}
