import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

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
      <body className={`${inter.variable} ${spaceMono.variable} antialiased bg-black text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
