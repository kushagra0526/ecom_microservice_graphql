'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Matches backend Joi schema: username min 2 max 50, email format, password min 6
    const validate = () => {
        if (username.trim().length < 2) return 'Username must be at least 2 characters.';
        if (username.trim().length > 50) return 'Username cannot exceed 50 characters.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            await register(username.trim(), email.trim(), password, role);
            router.push('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--mist)' }}>
            <div className="w-full max-w-md">
                <div className="rounded-xl p-8" style={{ background: 'white', border: '1px solid var(--wire)' }}>
                    <h1 className="text-2xl font-semibold mb-1"
                        style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}>
                        Create account
                    </h1>
                    <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
                        Already have one?{' '}
                        <Link href="/auth/login" style={{ color: 'var(--signal)' }}>Log in</Link>
                    </p>

                    {error && (
                        <div className="text-sm px-4 py-3 rounded-lg mb-5"
                            style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role toggle */}
                        <div>
                            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--slate)' }}>I want to</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['buyer', 'seller'].map((r) => (
                                    <button key={r} type="button" onClick={() => setRole(r)}
                                        className="py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{
                                            background: role === r ? 'var(--signal)' : 'var(--wire)',
                                            color: role === r ? 'white' : 'var(--slate)',
                                            border: `1px solid ${role === r ? 'var(--signal)' : 'var(--wire)'}`,
                                        }}>
                                        {r === 'buyer' ? '🛒 Buy products' : '📦 Sell products'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. kushagra" required
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)' }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" required
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)' }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters" required
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)' }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')} />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
                            style={{ background: 'var(--signal)', opacity: loading ? 0.6 : 1 }}>
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-xs mt-4 text-center" style={{ color: 'var(--slate)' }}>
                        Admin accounts are assigned internally.
                    </p>
                </div>
            </div>
        </div>
    );
}
