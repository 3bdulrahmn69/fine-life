'use client';

import { Button } from '../ui/button';
import Container from '../ui/container';
import Link from 'next/link';
import {
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiDollarSign,
  FiBarChart,
  FiPieChart,
  FiCreditCard,
  FiTrendingDown,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fine Life',
    description:
      'Smart financial management app with expense tracking, budgeting, and community insights',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free plan with premium features available',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '15000',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Container
        size="full"
        padding="xl"
        className="relative overflow-hidden min-h-screen flex items-center"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-background via-primary-background to-primary-accent/5">
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-primary-accent/20 rounded-full animate-float-${
                  i % 4
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-accent/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-primary-button/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-accent/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <FiDollarSign className="absolute top-20 left-20 text-4xl text-primary-accent/30 animate-float-1" />
          <FiBarChart className="absolute top-32 right-32 text-5xl text-primary-accent/20 animate-float-2" />
          <FiPieChart className="absolute bottom-32 left-32 text-4xl text-primary-accent/25 animate-float-3" />
          <FiCreditCard className="absolute bottom-20 right-20 text-3xl text-primary-accent/30 animate-float-1" />
          <FiTrendingUp className="absolute top-1/3 left-16 text-3xl text-green-400/40 animate-float-2" />
          <FiTrendingDown className="absolute bottom-1/3 right-16 text-2xl text-red-400/30 animate-float-3" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-card/50 backdrop-blur-sm border border-primary-border/50 mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">
              10,000+ users trust Fine Life
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-6xl md:text-8xl font-bold text-primary-foreground mb-6 leading-tight transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Transform Your
            <span className="bg-gradient-to-r from-primary-accent via-primary-button to-primary-accent/80 bg-clip-text text-transparent block animate-gradient-x">
              Financial Life
            </span>
          </h1>

          {/* Subheading */}
          <p
            className={`text-xl md:text-2xl text-primary-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto transition-all duration-1000 delay-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Take control of your finances with{' '}
            <span className="text-primary-accent font-semibold">
              smart tracking
            </span>
            ,{' '}
            <span className="text-primary-accent font-semibold">
              intelligent budgeting
            </span>
            , and{' '}
            <span className="text-primary-accent font-semibold">
              community-driven insights
            </span>
            . Join thousands who are already building wealth systematically.
          </p>

          {/* Key Benefits with Icons */}
          <div
            className={`flex flex-wrap justify-center gap-8 mb-12 transition-all duration-1000 delay-600 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary-card/30 backdrop-blur-sm border border-primary-border/30 hover:bg-primary-card/50 transition-all duration-300 group">
              <FiTrendingUp className="text-2xl text-primary-accent group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-primary-foreground">
                Smart Analytics
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary-card/30 backdrop-blur-sm border border-primary-border/30 hover:bg-primary-card/50 transition-all duration-300 group">
              <FiUsers className="text-2xl text-primary-accent group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-primary-foreground">
                Community Insights
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary-card/30 backdrop-blur-sm border border-primary-border/30 hover:bg-primary-card/50 transition-all duration-300 group">
              <FiTarget className="text-2xl text-primary-accent group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-primary-foreground">
                Progress Tracking
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-800 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-4 w-full sm:w-auto bg-gradient-to-r from-primary-button to-primary-button-hover hover:shadow-lg hover:shadow-primary-button/25 transform hover:scale-105 transition-all duration-300 group"
                aria-label="Start your financial journey with Fine Life"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  Start Your Journey
                </span>
                <FiTrendingUp className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 w-full sm:w-auto border-2 border-primary-border hover:border-primary-accent hover:bg-primary-accent/5 transform hover:scale-105 transition-all duration-300 group"
                aria-label="Sign in to your Fine Life account"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  Sign In
                </span>
                <FiUsers className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-primary-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                $2.5M+
              </div>
              <div className="text-primary-muted-foreground">Money Tracked</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-primary-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-primary-muted-foreground">Active Users</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-primary-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                98%
              </div>
              <div className="text-primary-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-primary-muted-foreground">
            <div className="w-6 h-10 border-2 border-primary-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary-accent rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>

        <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(360deg); }
        }
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
      `}</style>
      </Container>
    </>
  );
}
