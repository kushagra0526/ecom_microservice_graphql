import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Voltline — Tech Accessories',
  description: 'Minimal everyday carry tech',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <AuthProvider>
          <Nav />
          <main className="min-h-screen" style={{ background: 'var(--mist)' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
