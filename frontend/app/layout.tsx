import { ReactNode } from 'react';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AgroBrain AI - Smart Farming Assistant',
  description: 'AI-powered smart farming platform for Indian farmers. Get weather predictions, crop recommendations, and farming advice.',
};

export default function RootLayout({
  children
}: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
