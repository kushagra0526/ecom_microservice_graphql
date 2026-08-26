'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthUser {
    userId: string;
    role: 'buyer' | 'seller' | 'admin';
    token: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE_URL!;
const LS_KEY = 'voltline_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LS_KEY);
            if (stored) setUser(JSON.parse(stored));
        } catch {
            localStorage.removeItem(LS_KEY);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${USER_SERVICE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            // Surface the real backend message — no generic "something went wrong"
            throw new Error(data.message || 'Login failed');
        }

        const authUser: AuthUser = {
            userId: data.userId,
            role: data.role,
            token: data.token,
        };

        setUser(authUser);
        localStorage.setItem(LS_KEY, JSON.stringify(authUser));
    };

    const register = async (
        username: string,
        email: string,
        password: string,
        role: 'buyer' | 'seller'
    ) => {
        const res = await fetch(`${USER_SERVICE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        // After register, auto-login
        await login(email, password);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(LS_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
