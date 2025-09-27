'use client';

import {
  FiDollarSign,
  FiPieChart,
  FiUsers,
  FiTarget,
  FiSmartphone,
  FiShield,
  FiTrendingUp,
  FiBell,
  FiBarChart,
  FiCreditCard,
  FiZap,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function FeaturesSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative py-32 overflow-hidden bg-gradient-to-b from-primary-background via-primary-accent/5 to-primary-background"
      id="features"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary-accent/20 rounded-full animate-float-1" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary-accent/10 rounded-lg rotate-45 animate-float-2" />
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border-2 border-primary-accent/30 rounded-full animate-float-3" />
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-primary-accent/5 rounded-full animate-float-1" />

        {/* Floating icons */}
        <FiDollarSign className="absolute top-32 left-20 text-3xl text-primary-accent/40 animate-float-2" />
        <FiBarChart className="absolute top-60 right-32 text-4xl text-primary-accent/30 animate-float-3" />
        <FiCreditCard className="absolute bottom-60 left-32 text-3xl text-primary-accent/35 animate-float-1" />
        <FiZap className="absolute bottom-32 right-40 text-2xl text-primary-accent/40 animate-float-2" />

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary-background to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-accent/10 backdrop-blur-sm border border-primary-accent/20 mb-6">
            <FiZap className="text-primary-accent animate-pulse" />
            <span className="text-sm font-medium text-primary-accent">
              Powerful Features
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Everything You Need to
            <span className="bg-gradient-to-r from-primary-accent to-primary-button bg-clip-text text-transparent block">
              Succeed Financially
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-primary-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Powerful features designed to make financial management effortless,
            effective, and even enjoyable. Built for modern life with
            cutting-edge technology.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: FiDollarSign,
              title: 'Smart Expense Tracking',
              description:
                'Effortlessly track every expense with AI-powered categorization, receipt scanning, and automatic merchant detection.',
              delay: 200,
            },
            {
              icon: FiTarget,
              title: 'Intelligent Budgeting',
              description:
                'Set smart budgets that adapt to your lifestyle with predictive analytics and get proactive alerts before overspending.',
              delay: 400,
            },
            {
              icon: FiPieChart,
              title: 'Advanced Analytics',
              description:
                'Beautiful insights and comprehensive reports that help you understand spending patterns and identify opportunities.',
              delay: 600,
            },
            {
              icon: FiUsers,
              title: 'Community Insights',
              description:
                'Compare prices and learn from a global community of smart spenders. See real-time market trends and local pricing data.',
              delay: 800,
            },
            {
              icon: FiSmartphone,
              title: 'Mobile Optimized',
              description:
                'Responsive design optimized for any device with seamless cross-device synchronization and intuitive touch interfaces.',
              delay: 1000,
            },
            {
              icon: FiShield,
              title: 'Enterprise Security',
              description:
                'Your financial data is protected with enterprise-grade encryption, secure authentication, and privacy-first design principles.',
              delay: 1200,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-primary-card/50 backdrop-blur-sm p-8 rounded-2xl border border-primary-border/50 hover:border-primary-accent/50 hover:shadow-2xl hover:shadow-primary-accent/10 transition-all duration-500 hover:-translate-y-2 ${
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${feature.delay}ms` }}
            >
              {/* Floating accent */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary-accent/20 rounded-full blur-sm group-hover:bg-primary-accent/40 transition-colors duration-300" />

              <div className="w-16 h-16 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-3xl text-primary-accent group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h3 className="text-xl font-bold text-primary-foreground mb-4 group-hover:text-primary-accent transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-primary-muted-foreground leading-relaxed group-hover:text-primary-foreground/80 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-accent to-primary-button group-hover:w-full transition-all duration-500 rounded-b-2xl" />
            </div>
          ))}
        </div>

        {/* Enhanced Features Row */}
        <div
          className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 delay-1400 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative group bg-gradient-to-br from-primary-accent/10 via-primary-accent/5 to-transparent p-8 rounded-3xl border border-primary-accent/30 hover:border-primary-accent/50 hover:shadow-xl hover:shadow-primary-accent/20 transition-all duration-500 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-20 h-20 border border-primary-accent rounded-full" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-primary-accent rounded-lg rotate-45" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-accent/20 rounded-xl flex items-center justify-center group-hover:bg-primary-accent/30 transition-colors duration-300">
                  <FiTrendingUp className="text-2xl text-primary-accent" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground">
                  Predictive Analytics
                </h3>
              </div>
              <p className="text-primary-muted-foreground text-lg leading-relaxed mb-4">
                AI-powered insights that predict your spending patterns and help
                you make better financial decisions before it&apos;s too late.
              </p>
              <div className="flex items-center gap-2 text-primary-accent font-semibold">
                <FiZap className="text-lg" />
                <span>Machine Learning Powered</span>
              </div>
            </div>
          </div>

          <div className="relative group bg-gradient-to-br from-primary-button/10 via-primary-button/5 to-transparent p-8 rounded-3xl border border-primary-button/30 hover:border-primary-button/50 hover:shadow-xl hover:shadow-primary-button/20 transition-all duration-500 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-6 left-6 w-12 h-12 border-2 border-primary-button rounded-full animate-pulse" />
              <div className="absolute bottom-6 right-6 w-8 h-8 bg-primary-button rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-button/20 rounded-xl flex items-center justify-center group-hover:bg-primary-button/30 transition-colors duration-300">
                  <FiBell className="text-2xl text-primary-button" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground">
                  Smart Notifications
                </h3>
              </div>
              <p className="text-primary-muted-foreground text-lg leading-relaxed mb-4">
                Intelligent alerts for budget limits, unusual spending, bill
                reminders, and personalized financial tips delivered at the
                right time.
              </p>
              <div className="flex items-center gap-2 text-primary-button font-semibold">
                <FiBell className="text-lg" />
                <span>Real-time Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-5deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 9s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
