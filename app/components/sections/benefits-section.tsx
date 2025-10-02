'use client';

import {
  FiTrendingUp,
  FiZap,
  FiTarget,
  FiSmile,
  FiHeart,
  FiAward,
  FiStar,
} from 'react-icons/fi';
import { BiTrophy, BiRocket, BiTrendingUp } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import Container from '../ui/container';

export default function BenefitsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container
      id="benefits"
      background="accent"
      className="relative py-32 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating shapes */}
        <div className="absolute top-16 left-16 w-20 h-20 bg-primary-accent/10 rounded-full blur-xl animate-float-1" />
        <div className="absolute top-32 right-24 w-16 h-16 bg-primary-button/10 rounded-lg rotate-45 animate-float-2" />
        <div className="absolute bottom-24 left-1/3 w-24 h-24 border border-primary-accent/20 rounded-full animate-float-3" />
        <div className="absolute bottom-16 right-16 w-18 h-18 bg-primary-accent/5 rounded-full animate-float-1" />

        {/* Floating icons */}
        <FiHeart className="absolute top-40 left-32 text-2xl text-primary-accent/40 animate-float-2" />
        <BiRocket className="absolute top-60 right-40 text-3xl text-primary-button/30 animate-float-3" />
        <FiStar className="absolute bottom-40 left-40 text-2xl text-primary-accent/35 animate-float-1" />
        <BiTrendingUp className="absolute bottom-32 right-32 text-3xl text-primary-button/25 animate-float-2" />

        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-accent/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-accent/10 backdrop-blur-sm border border-primary-accent/20">
              <FiAward className="text-primary-accent" />
              <span className="text-sm font-medium text-primary-accent">
                Life-Changing Results
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              More Than Just
              <span className="bg-gradient-to-r from-primary-accent to-primary-button bg-clip-text text-transparent block">
                Tracking
              </span>
            </h2>

            <p className="text-xl text-primary-muted-foreground leading-relaxed">
              Fine Life transforms how you think about money and helps you build
              lasting financial habits that create real, measurable change in
              your life. It&apos;s not just an app—it&apos;s your financial
              coach.
            </p>

            {/* Benefits List */}
            <div className="space-y-6">
              {[
                {
                  icon: FiTrendingUp,
                  title: 'Build Wealth Systematically',
                  description:
                    'Turn your financial planning into systematic wealth building with smart budgeting, automated tracking, and insightful analytics.',
                  delay: 400,
                },
                {
                  icon: FiZap,
                  title: 'Save Time & Reduce Stress',
                  description:
                    'Automate your financial management with smart categorization, recurring transaction tracking, and proactive budget alerts.',
                  delay: 600,
                },
                {
                  icon: FiTarget,
                  title: 'Achieve Your Dreams',
                  description:
                    "Whether it's buying a home, traveling the world, or starting a business, Fine Life helps you turn financial dreams into reality.",
                  delay: 800,
                },
                {
                  icon: FiSmile,
                  title: 'Live Your Best Life',
                  description:
                    'Make confident financial decisions that align with your values and dreams. Experience the peace of mind that comes with financial clarity.',
                  delay: 1000,
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-5 p-6 rounded-2xl bg-primary-card/30 backdrop-blur-sm border border-primary-border/30 hover:border-primary-accent/50 hover:shadow-lg hover:shadow-primary-accent/10 transition-all duration-500 group ${
                    mounted
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${benefit.delay}ms` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="text-2xl text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary-foreground mb-3 group-hover:text-primary-accent transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-primary-muted-foreground leading-relaxed group-hover:text-primary-foreground/80 transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Success Stories */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Success Story Card */}
            <div className="relative group bg-gradient-to-br from-primary-card via-primary-card/80 to-primary-accent/10 p-8 rounded-3xl border border-primary-border/50 hover:border-primary-accent/50 hover:shadow-2xl hover:shadow-primary-accent/20 transition-all duration-500 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-primary-accent/10 rounded-full blur-sm" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-primary-accent/20 rounded-lg rotate-45" />

              <div className="relative z-10 flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-accent to-primary-button rounded-2xl flex items-center justify-center shadow-lg">
                  <BiTrophy className="text-3xl text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-foreground">
                    Success Stories
                  </h3>
                  <p className="text-primary-muted-foreground">
                    Real results from real users
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'Average Savings',
                    value: '$3,200/year',
                    icon: FiTrendingUp,
                  },
                  { label: 'Time Saved', value: '5+ hours/month', icon: FiZap },
                  {
                    label: 'Budget Success',
                    value: '94% success rate',
                    icon: FiTarget,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-primary-background/50 rounded-xl border border-primary-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className="text-xl text-primary-accent" />
                      <span className="font-medium text-primary-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <span className="font-bold text-primary-accent">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-primary-card/50 backdrop-blur-sm p-6 rounded-2xl border border-primary-border/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiHeart className="text-xl text-primary-accent" />
                </div>
                <div>
                  <p className="text-primary-muted-foreground italic mb-4 leading-relaxed">
                    &ldquo;Fine Life didn&apos;t just help me save money—it
                    completely changed how I think about my finances. I went
                    from living paycheck to paycheck to achieving my dream of
                    buying a home.&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-accent rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-accent-foreground">
                        SM
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-primary-foreground">
                        Sarah Martinez
                      </div>
                      <div className="text-sm text-primary-muted-foreground">
                        Homeowner & Entrepreneur
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 9s ease-in-out infinite; }
      `}</style>
    </Container>
  );
}
