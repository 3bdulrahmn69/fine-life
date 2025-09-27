import { Button } from '../ui/button';
import Link from 'next/link';
import {
  BiCheck,
  BiCrown,
  BiTrendingUp,
  BiShield,
  BiDownload,
  BiBarChart,
  BiBullseye,
  BiHeart,
  BiStar,
} from 'react-icons/bi';
import {
  FiZap,
  FiTrendingUp,
  FiShield,
  FiDownload,
  FiBarChart,
  FiTarget,
  FiStar,
} from 'react-icons/fi';
import Container from '../ui/container';

export default function PremiumSection() {
  const premiumFeatures = [
    {
      icon: BiBarChart,
      altIcon: FiBarChart,
      title: 'Advanced Analytics Dashboard',
      description:
        'Deep insights with custom reports, trend analysis, and predictive forecasting to understand your financial patterns.',
      highlight: 'Save 2+ hours/month on financial analysis',
      color: 'from-blue-500 to-cyan-500',
      delay: '0s',
    },
    {
      icon: BiBullseye,
      altIcon: FiTarget,
      title: 'Unlimited Smart Budgets',
      description:
        'Create unlimited budgets with AI-powered suggestions, automatic adjustments, and predictive alerts.',
      highlight: '89% budget success rate',
      color: 'from-green-500 to-emerald-500',
      delay: '0.1s',
    },
    {
      icon: BiTrendingUp,
      altIcon: FiTrendingUp,
      title: 'Investment Tracking',
      description:
        'Track stocks, crypto, and other investments with real-time updates and portfolio performance analytics.',
      highlight: 'Portfolio tracking included',
      color: 'from-purple-500 to-pink-500',
      delay: '0.2s',
    },
    {
      icon: BiShield,
      altIcon: FiShield,
      title: 'Priority Support & Training',
      description:
        '24/7 premium support with dedicated account manager and personalized financial coaching sessions.',
      highlight: '<2 hour response time',
      color: 'from-orange-500 to-red-500',
      delay: '0.3s',
    },
    {
      icon: BiDownload,
      altIcon: FiDownload,
      title: 'Unlimited Data Export',
      description:
        'Export data in any format (CSV, Excel, PDF, QuickBooks) with advanced filtering and scheduling.',
      highlight: 'All formats supported',
      color: 'from-teal-500 to-cyan-500',
      delay: '0.4s',
    },
    {
      icon: BiCrown,
      altIcon: FiStar,
      title: 'Automation & Integrations',
      description:
        'Automated transaction imports, recurring transaction management, and integrations with popular financial tools.',
      highlight: 'Auto-sync included',
      color: 'from-yellow-500 to-orange-500',
      delay: '0.5s',
    },
  ];

  const premiumBenefits = [
    'Everything in Free plan (unlimited)',
    'Advanced analytics & predictive insights',
    'Investment portfolio tracking',
    'Priority customer support & coaching',
    'Unlimited data export & integrations',
    'Auto-sync & automation features',
  ];

  const freeFeatures = [
    'Unlimited expense tracking',
    '5 budgets per month',
    'Community price sharing',
    'Basic analytics & reports',
    'Email support',
    'Cross-device sync',
  ];

  return (
    <Container
      background="card"
      className="relative py-20 overflow-hidden"
      id="pricing"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-24 h-24 bg-primary-accent/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-32 right-24 w-20 h-20 bg-blue-500/10 rounded-full blur-lg animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-float-fast"></div>
        <div className="absolute bottom-24 right-16 w-16 h-16 bg-green-500/10 rounded-full blur-lg animate-float-slow"></div>
        <div className="absolute top-2/3 left-20 w-14 h-14 bg-yellow-500/10 rounded-full blur-md animate-float-medium"></div>
        <div className="absolute top-1/4 right-1/3 w-18 h-18 bg-pink-500/10 rounded-full blur-lg animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-accent to-primary-accent/80 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <BiCrown className="text-lg" />
            Premium Experience
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Unlock Your Financial Superpowers
          </h2>
          <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Take your financial management to the next level with premium
            features designed for serious wealth builders and budget masters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-primary-card/60 backdrop-blur-sm p-6 rounded-3xl border border-primary-border/50 hover:border-primary-accent/30 hover:shadow-2xl hover:shadow-primary-accent/10 transition-all duration-500 overflow-hidden animate-slide-up"
              style={{ animationDelay: feature.delay }}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
              />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-3xl text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-card-foreground mb-2 group-hover:text-primary-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-primary-text text-sm leading-relaxed mb-3 group-hover:text-primary-text/90 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="text-xs font-medium text-primary-accent bg-primary-accent/10 px-3 py-1 rounded-full inline-block border border-primary-accent/20 group-hover:bg-primary-accent/20 transition-colors duration-300">
                      {feature.highlight}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Pricing Card */}
        <div className="bg-primary-card/40 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 shadow-2xl max-w-2xl mx-auto mb-16 animate-fade-in animation-delay-600">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <BiCrown className="text-3xl text-primary-accent" />
              </div>
              <span className="text-sm font-semibold text-primary-accent bg-primary-accent/10 px-3 py-1 rounded-full border border-primary-accent/20">
                MOST POPULAR
              </span>
            </div>
            <div className="text-6xl font-bold bg-gradient-to-r from-primary-accent to-primary-accent/80 bg-clip-text text-transparent mb-2">
              $4.99<span className="text-xl text-primary-text">/month</span>
            </div>
            <div className="text-primary-text">
              Cancel anytime • No setup fees • 30-day money-back guarantee
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {premiumBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BiCheck className="text-green-500 text-sm" />
                </div>
                <span className="text-primary-card-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/auth/signup?plan=premium">
              <Button
                size="lg"
                className="w-full text-lg py-4 mb-4 group relative overflow-hidden shadow-2xl hover:shadow-primary-accent/25 transition-all duration-300"
                aria-label="Start your 30-day free premium trial"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <BiCrown className="mr-2 text-xl group-hover:animate-bounce" />
                <span className="relative z-10">Start Premium Trial</span>
                <FiZap className="ml-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <p className="text-sm text-primary-text">
              30 days free • Upgrade or cancel anytime • No questions asked
            </p>
          </div>
        </div>

        {/* Enhanced Free vs Premium Comparison */}
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in animation-delay-800">
          <div className="bg-primary-card/40 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 hover:border-primary-border/70 transition-colors duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                Free Plan
              </h3>
              <div className="text-4xl font-bold text-primary-accent mb-4">
                $0
              </div>
              <p className="text-primary-text/80">
                Perfect for getting started
              </p>
            </div>

            <div className="space-y-3 text-primary-text">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <BiCheck className="text-green-500 text-xs" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-accent/10 via-primary-accent/5 to-primary-accent/10 backdrop-blur-sm p-8 rounded-3xl border border-primary-accent/20 relative shadow-xl hover:shadow-2xl hover:shadow-primary-accent/10 transition-all duration-300">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-primary-accent rounded-full flex items-center justify-center shadow-lg">
                <BiStar className="text-white text-lg" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                Premium Plan
              </h3>
              <div className="text-4xl font-bold text-primary-accent mb-4">
                $4.99/mo
              </div>
              <p className="text-primary-text/80">
                For serious wealth builders
              </p>
            </div>

            <div className="space-y-3 text-primary-text">
              <div className="flex items-center gap-3 mb-2">
                <BiHeart className="text-red-500 text-lg flex-shrink-0" />
                <span className="font-semibold text-primary-accent">
                  Everything in Free +
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BiCheck className="text-green-500 text-xs" />
                </div>
                <span>Unlimited budgets & categories</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BiCheck className="text-green-500 text-xs" />
                </div>
                <span>Advanced analytics & AI insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BiCheck className="text-green-500 text-xs" />
                </div>
                <span>Investment portfolio tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BiCheck className="text-green-500 text-xs" />
                </div>
                <span>Priority support & coaching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BiCheck className="text-green-500 text-xs" />
                </div>
                <span>Auto-sync & unlimited exports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(120deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(60deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </Container>
  );
}
