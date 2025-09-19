import HeroSection from './components/sections/hero-section';
import FeaturesSection from './components/sections/features-section';
import BenefitsSection from './components/sections/benefits-section';
import TestimonialsSection from './components/sections/testimonials-section';
import StatsSection from './components/sections/stats-section';
import HowItWorksSection from './components/sections/how-it-works-section';
import FAQSection from './components/sections/faq-section';
import PremiumSection from './components/sections/premium-section';
import CTASection from './components/sections/cta-section';
import Footer from './components/footer';
import Header from './components/header';

export default function Home() {
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
