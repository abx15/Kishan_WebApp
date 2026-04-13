import { ReactNode } from 'react';
import './globals.css';
import { Inter, DM_Sans } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

interface RootLayoutProps {
  children: ReactNode;
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AgroBrain AI - The Living Laboratory',
  description: 'AI-powered smart farming platform for Indian farmers. Precision agriculture, soil intelligence, and real-time expert advice.',
};

export default function RootLayout({
  children
}: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
