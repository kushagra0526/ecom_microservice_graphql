'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { gql } from './lib/gql';
import ProductCard, { Product } from './components/ProductCard';
import ProductCardSkeleton from './components/ProductCardSkeleton';
import { useCart } from './context/CartContext';

const LIMIT = 12;

const GET_PRODUCTS = `
  query GetProducts($limit: Int, $offset: Int) {
    getProducts(limit: $limit, offset: $offset) {
      data { id name description price }
      total
      limit
      offset
    }
  }
`;

interface ProductsResult {
  getProducts: {
    data: Product[];
    total: number;
    limit: number;
    offset: number;
  };
}

type Status = 'loading' | 'ok' | 'error' | 'empty';

export default function CatalogPage() {
  const { add } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProducts = useCallback(async (currentOffset: number, append: boolean) => {
    try {
      const data = await gql<ProductsResult>(GET_PRODUCTS, { limit: LIMIT, offset: currentOffset });
      const fetched = data.getProducts.data;

      setTotal(data.getProducts.total);
      setProducts((prev) => append ? [...prev, ...fetched] : fetched);
      setStatus(fetched.length === 0 && !append ? 'empty' : 'ok');
    } catch (err: unknown) {
      if (!append) {
        setErrorMsg(err instanceof Error ? err.message : 'Could not reach the server');
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts(0, false);
  }, [fetchProducts]);

  const loadMore = async () => {
    const next = offset + LIMIT;
    setLoadingMore(true);
    setOffset(next);
    await fetchProducts(next, true);
    setLoadingMore(false);
  };

  const hasMore = products.length < total;

  // ── Loading state ──────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="h-6 w-32 rounded mb-8 animate-pulse" style={{ background: 'var(--wire)' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p
          className="text-lg font-medium mb-2"
          style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
        >
          Gateway unreachable
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
          {errorMsg}
        </p>
        <button
          onClick={() => { setStatus('loading'); fetchProducts(0, false); }}
          className="text-sm px-5 py-2 rounded-lg text-white"
          style={{ background: 'var(--signal)' }}
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────
  if (status === 'empty') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 text-2xl"
          style={{ background: 'var(--wire)' }}
        >
          📦
        </div>
        <p
          className="text-xl font-semibold mb-2"
          style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
        >
          The shelves are empty
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
          No products yet. Sellers — log in and add your first listing from the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/login"
            className="text-sm px-5 py-2 rounded-lg text-white"
            style={{ background: 'var(--signal)' }}
          >
            Log in as seller
          </Link>
          <Link
            href="/auth/register"
            className="text-sm px-5 py-2 rounded-lg"
            style={{ background: 'var(--wire)', color: 'var(--ink)' }}
          >
            Create seller account
          </Link>
        </div>
      </div>
    );
  }

  // ── Catalog ────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
        >
          Shop
        </h1>
        <span className="text-xs" style={{ color: 'var(--slate)' }}>
          {total} {total === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={add} />
        ))}
        {/* Append skeletons while loading more */}
        {loadingMore && Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={`sk-${i}`} />)}
      </div>

      {/* Load more */}
      {hasMore && !loadingMore && (
        <div className="mt-10 text-center">
          <button
            onClick={loadMore}
            className="text-sm px-6 py-2.5 rounded-lg"
            style={{ background: 'var(--wire)', color: 'var(--ink)', border: '1px solid var(--wire)' }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
