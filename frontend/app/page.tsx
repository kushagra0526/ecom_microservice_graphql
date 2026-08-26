'use client';

import Link from 'next/link';
import { useAuth } from './context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1
        className="text-4xl font-semibold mb-3"
        style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
      >
        Voltline
      </h1>
      <p className="text-base mb-8" style={{ color: 'var(--slate)' }}>
        Minimal everyday carry tech — cables, chargers, stands.
      </p>

      {user ? (
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          Logged in as <strong>{user.role}</strong>. Products page coming next.
        </p>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/auth/register"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--signal)' }}
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: 'var(--wire)', color: 'var(--ink)' }}
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}
