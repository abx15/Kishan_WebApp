import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { routing } from '@/i18n/routing';
import './globals.css';

// Create a client
const queryClient = new QueryClient();

interface RootLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: {
    default: 'AgroBrain AI - Smart Farming Assistant',
    template: '%s | AgroBrain AI'
  },
  description: 'AI-powered smart farming platform for Indian farmers. Get weather predictions, crop recommendations, and farming advice in Hindi and English.',
  keywords: ['farming', 'agriculture', 'AI', 'weather', 'crops', 'Indian farmers', 'smart farming', 'agriculture technology'],
  authors: [{ name: 'AgroBrain Team' }],
  creator: 'AgroBrain AI',
  publisher: 'AgroBrain AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'AgroBrain AI - Smart Farming Assistant',
    description: 'AI-powered smart farming platform for Indian farmers. Get weather predictions, crop recommendations, and farming advice in Hindi and English.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://agrobrain.ai',
    siteName: 'AgroBrain AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AgroBrain AI - Smart Farming Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgroBrain AI - Smart Farming Assistant',
    description: 'AI-powered smart farming platform for Indian farmers. Get weather predictions, crop recommendations, and farming advice in Hindi and English.',
    images: ['/og-image.png'],
    creator: '@agrobrain_ai',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    manifest: '/manifest.json',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AgroBrain AI",
    "description": "AI-powered smart farming platform for Indian farmers. Get weather predictions, crop recommendations, and farming advice in Hindi and English.",
    "url": "https://agrobrain.ai",
    "applicationCategory": "AgricultureApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "author": {
      "@type": "Organization",
      "name": "AgroBrain Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AgroBrain AI"
    },
    "inLanguage": ["en", "hi"],
    "featureList": [
      "Weather predictions",
      "Crop recommendations", 
      "AI farming advice",
      "Hindi language support",
      "Mobile responsive design"
    ]
  };

  return (
    <html lang={locale}>
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AgroBrain" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/DM-Sans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </QueryClientProvider>
      </body>
    </html>
  );
}
