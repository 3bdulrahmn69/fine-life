import type { Metadata } from 'next';

export interface AuthPageConfig {
  type: 'signin' | 'signup';
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export function generateAuthMetadata(config: AuthPageConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.ogTitle,
      description: config.ogDescription,
      url: `/auth/${config.type}`,
      type: 'website',
    },
    twitter: {
      title: config.twitterTitle,
      description: config.twitterDescription,
    },
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/auth/${config.type}`,
    },
  };
}

export const authPageConfigs: Record<'signin' | 'signup', AuthPageConfig> = {
  signin: {
    type: 'signin',
    title: 'Sign In to Fine Life - Access Your Financial Dashboard',
    description:
      'Sign in to your Fine Life account to access your personal finance dashboard, track expenses, manage budgets.',
    keywords: [
      'signin',
      'login',
      'financial dashboard',
      'personal finance',
      'budget tracker',
      'expense management',
      'wealth building',
    ],
    ogTitle: 'Sign In to Fine Life - Your Financial Journey Starts Here',
    ogDescription:
      'Access your personal finance dashboard to track expenses, manage budgets, and build wealth systematically.',
    twitterTitle: 'Sign In to Fine Life',
    twitterDescription:
      'Access your personal finance dashboard to track expenses and build wealth.',
  },
  signup: {
    type: 'signup',
    title: 'Sign Up for Fine Life - Start Your Financial Journey',
    description:
      'Create your Fine Life account to access powerful financial tools, track expenses, manage budgets, and build wealth systematically. Join thousands taking control of their finances.',
    keywords: [
      'signup',
      'register',
      'create account',
      'financial dashboard',
      'personal finance',
      'budget tracker',
      'expense management',
      'wealth building',
      'financial freedom',
    ],
    ogTitle: 'Join Fine Life - Transform Your Financial Future',
    ogDescription:
      'Create your account and start your journey to financial freedom with smart tracking, intelligent budgeting, and community-driven insights.',
    twitterTitle: 'Sign Up for Fine Life',
    twitterDescription:
      'Create your account and start building wealth with smart financial tools.',
  },
};
