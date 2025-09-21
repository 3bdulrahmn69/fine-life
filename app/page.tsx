import HomeContent from './components/home/home-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Transform your financial life with smart tracking, intelligent budgeting, and community-driven insights. Start your journey to financial freedom today.',
  keywords: [
    'finance app',
    'budget tracker',
    'expense management',
    'financial dashboard',
    'wealth building',
    'money management app',
    'personal finance tool',
    'budget planning',
    'savings goals',
    'financial freedom',
  ],
  openGraph: {
    title: 'Transform Your Financial Life | Fine Life',
    description:
      'Take control of your finances with smart tracking, intelligent budgeting, and community-driven insights. Join thousands building wealth systematically.',
    url: '/',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Fine Life - Financial Management Platform',
      },
    ],
  },
  twitter: {
    title: 'Transform Your Financial Life | Fine Life',
    description:
      'Take control of your finances with smart tracking, intelligent budgeting, and community-driven insights.',
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return <HomeContent />;
}
