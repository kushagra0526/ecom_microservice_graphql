'use client';

import Link from 'next/link';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface Props {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="group block relative rounded-xl overflow-hidden"
            style={{ background: 'var(--mist)', border: '1px solid var(--wire)' }}
        >
            {/* Product image area — monochrome placeholder styled for tech category */}
            <div
                className="w-full h-44 flex items-center justify-center select-none"
                style={{ background: 'var(--wire)' }}
            >
                <span className="text-4xl opacity-40">⚡</span>
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
                    style={{
                        fontFamily: 'var(--font-mono), monospace',
                        color: 'var(--signal)',
                        letterSpacing: '-0.01em',
                    }}
                >
                    {product.price.toFixed(2)}{' '}
                    <span className="text-xs font-normal" style={{ color: 'var(--slate)' }}>
                        USD
                    </span>
                </p>
            </div>

            {/* Signature: "Add to cart" strip slides up from bottom on hover */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onAddToCart?.(product);
                }}
                className="
          absolute bottom-0 left-0 right-0
          py-2.5 text-xs font-medium text-white text-center
          translate-y-full group-hover:translate-y-0
          transition-transform duration-200 ease-out
        "
                style={{ background: 'var(--signal)' }}
            >
                Add to cart
            </button>
        </Link>
    );
}
