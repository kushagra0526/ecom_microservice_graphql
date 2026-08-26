'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
    const { user, logout } = useAuth();

    return (
        <nav
            className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50"
            style={{ background: 'var(--ink)', borderBottom: '1px solid transparent' }}
        >
            {/* Logo */}
            <Link
                href="/"
                className="text-xl tracking-tight text-white"
                style={{ fontFamily: 'var(--font-space), system-ui', fontWeight: 600 }}
            >
                Voltline
            </Link>

            {/* Center links */}
            <div className="hidden md:flex gap-8">
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                    Shop
                </Link>
                {user?.role === 'seller' && (
                    <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                )}
                {user?.role === 'admin' && (
                    <Link href="/orders" className="text-sm text-gray-300 hover:text-white transition-colors">
                        Orders
                    </Link>
                )}
            </div>

            {/* Right: auth */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="text-xs text-gray-400 hidden sm:block">
                            {user.role} · {user.userId.slice(-6)}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/auth/register"
                            className="text-sm px-4 py-1.5 rounded-md text-white transition-colors"
                            style={{ background: 'var(--signal)' }}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
