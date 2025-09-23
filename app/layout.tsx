import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './providers/auth-provider';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Fine Life - Transform Your Financial Future',
    template: '%s | Fine Life',
  },
  description:
    'Take control of your finances with smart tracking, intelligent budgeting, and community-driven insights. Join thousands building wealth systematically with Fine Life.',
  keywords: [
    'personal finance',
    'budgeting',
    'financial planning',
    'wealth management',
    'expense tracking',
    'financial goals',
    'money management',
    'financial dashboard',
    'budget planner',
    'savings tracker',
  ],
  authors: [{ name: 'Fine Life Team' }],
  creator: 'Fine Life',
  publisher: 'Fine Life',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fine-life.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Fine Life - Transform Your Financial Future',
    description:
      'Take control of your finances with smart tracking, intelligent budgeting, and community-driven insights. Join thousands building wealth systematically.',
    siteName: 'Fine Life',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Fine Life - Financial Management Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fine Life - Transform Your Financial Future',
    description:
      'Take control of your finances with smart tracking, intelligent budgeting, and community-driven insights.',
    images: ['/og-image.jpg'], // Same image as Open Graph
    creator: '@finelifeapp', // Replace with your Twitter handle
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
    google: 'your-google-site-verification-code', // Replace with actual verification code
  },
  category: 'finance',
  other: {
    'application-name': 'Fine Life',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Fine Life',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#000000',
    'color-scheme': 'light dark',
    referrer: 'strict-origin-when-cross-origin',
    preconnect: 'https://fonts.googleapis.com',
    'dns-prefetch': 'https://fonts.gstatic.com',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Fine Life',
    description:
      'A comprehensive financial management platform for personal finance tracking, budgeting, and wealth building.',
    url: 'https://fine-life.vercel.app',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Fine Life Team',
    },
    featureList: [
      'Expense Tracking',
      'Budget Planning',
      'Financial Goal Setting',
      'Transaction Management',
      'Financial Analytics',
      'Community Insights',
    ],
    screenshot: '/og-image.jpg',
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon-96x96.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip Links for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-accent text-primary-accent-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-primary-accent text-primary-accent-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2"
        >
          Skip to navigation
        </a>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            themes={['light', 'dark', 'life', 'system']}
            enableSystem={true}
            storageKey="fine-life-theme"
          >
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              className="toast-container"
            />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
