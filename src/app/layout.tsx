import type { Metadata } from 'next';
import { Inter, Space_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Podium | Psychological Detective',
  description: 'An immersive psychological detective platform where you solve crimes driven by psychological manipulation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${spaceMono.variable} ${outfit.variable} antialiased bg-[#020202] text-zinc-300 min-h-screen selection:bg-fuchsia-500/30 selection:text-fuchsia-100`}>
        {children}
      </body>
    </html>
  );
}
