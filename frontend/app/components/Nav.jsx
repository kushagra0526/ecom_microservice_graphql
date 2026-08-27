'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Nav() {
    const { user, logout } = useAuth();
    const { count } = useCart();

    return (
        <nav
            className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-50"
            style={{ background: 'var(--ink)' }}
        >
            <Link
                href="/"
                className="text-lg sm:text-xl tracking-tight text-white flex-shrink-0"
                style={{ fontFamily: 'var(--font-space), system-ui', fontWeight: 600 }}
            >
                Voltline
            </Link>

            {/* Center — desktop only */}
            <div className="hidden md:flex gap-8">
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Shop</Link>
                {user?.role === 'seller' && (
                    <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                )}
                {user?.role === 'admin' && (
                    <Link href="/orders" className="text-sm text-gray-300 hover:text-white transition-colors">Orders</Link>
                )}
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-3 sm:gap-5">
                <Link href="/cart" className="relative text-sm text-gray-300 hover:text-white transition-colors">
                    Cart
                    {count > 0 && (
                        <span
                            className="absolute -top-2 -right-4 w-4 h-4 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ background: 'var(--signal)', fontSize: '10px' }}
                        >
                            {count}
                        </span>
                    )}
                </Link>

                {user ? (
                    <>
                        <span className="text-xs text-gray-400 hidden sm:block">{user.role}</span>
                        {user.role !== 'buyer' && (
                            <Link
                                href={user.role === 'admin' ? '/orders' : '/dashboard'}
                                className="text-xs text-gray-300 hover:text-white transition-colors md:hidden"
                            >
                                {user.role === 'admin' ? 'Orders' : 'Dash'}
                            </Link>
                        )}
                        <button onClick={logout} className="text-sm text-gray-300 hover:text-white transition-colors">
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors">Log in</Link>
                        <Link
                            href="/auth/register"
                            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md text-white flex-shrink-0"
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
