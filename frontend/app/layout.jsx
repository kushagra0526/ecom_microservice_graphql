import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Nav from './components/Nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
    title: 'Voltline — Tech Accessories',
    description: 'Minimal everyday carry tech',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
                <AuthProvider>
                    <CartProvider>
                        <Nav />
                        <main className="min-h-screen" style={{ background: 'var(--mist)' }}>
                            {children}
                        </main>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
