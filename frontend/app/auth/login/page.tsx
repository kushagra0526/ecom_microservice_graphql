'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Email and password are required.'); return; }

        setLoading(true);
        try {
            await login(email.trim(), password);
            router.push(returnTo);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--mist)' }}>
            <div className="w-full max-w-md">
                <div className="rounded-xl p-8" style={{ background: 'white', border: '1px solid var(--wire)' }}>
                    <h1
                        className="text-2xl font-semibold mb-1"
                        style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}
                    >
                        Log in
                    </h1>
                    <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
                        No account?{' '}
                        <Link href="/auth/register" style={{ color: 'var(--signal)' }}>Register</Link>
                    </p>

                    {returnTo !== '/' && (
                        <div
                            className="text-xs px-4 py-2.5 rounded-lg mb-4"
                            style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
                        >
                            Log in to continue to checkout
                        </div>
                    )}

                    {error && (
                        <div
                            className="text-sm px-4 py-3 rounded-lg mb-5"
                            style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)' }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                required
                                autoComplete="current-password"
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)' }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
                            style={{ background: 'var(--signal)', opacity: loading ? 0.6 : 1 }}
                        >
                            {loading ? 'Logging in…' : 'Log in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Suspense boundary required for useSearchParams in Next.js app router
export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
