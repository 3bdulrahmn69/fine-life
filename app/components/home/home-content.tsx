'use client';

import { useSession } from 'next-auth/react';
import { PageLoading } from '../ui/spinner';
import OverviewPage from '../../(dashboard)/overview/page';
import Dashboard from '../../(dashboard)/components/dashboard';

// Home page components (these should be imported as needed)
import HeroSection from '../sections/hero-section';
import FeaturesSection from '../sections/features-section';
import BenefitsSection from '../sections/benefits-section';
import TestimonialsSection from '../sections/testimonials-section';
import StatsSection from '../sections/stats-section';
import HowItWorksSection from '../sections/how-it-works-section';
import FAQSection from '../sections/faq-section';
import PremiumSection from '../sections/premium-section';
import CTASection from '../sections/cta-section';
import Footer from '../footer';
import Header from '../header';

export default function HomeContent() {
  const { data: session, status } = useSession();

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <PageLoading text="Loading your dashboard..." />;
  }

  // If user is authenticated, show overview directly
  if (session) {
    return (
      <Dashboard>
        <OverviewPage />
      </Dashboard>
    );
  }

  // If user is not authenticated, show home page
  return (
    <div className="min-h-screen bg-primary-background">
      {/* Header */}
      <Header />

      {/* Page Sections */}
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <StatsSection />
      <HowItWorksSection />
      <FAQSection />
      <PremiumSection />
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
