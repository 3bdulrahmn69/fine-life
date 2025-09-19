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
import Container from '../ui/container';

export default function PremiumSection() {
  const premiumFeatures = [
    {
      icon: BiBarChart,
      title: 'Advanced Analytics Dashboard',
      description:
        'Deep insights with custom reports, trend analysis, and predictive forecasting to understand your financial patterns.',
      highlight: 'Save 2+ hours/month on financial analysis',
    },
    {
      icon: BiBullseye,
      title: 'Unlimited Smart Budgets',
      description:
        'Create unlimited budgets with AI-powered suggestions, automatic adjustments, and predictive alerts.',
      highlight: '89% budget success rate',
    },
    {
      icon: BiTrendingUp,
      title: 'Investment Tracking',
      description:
        'Track stocks, crypto, and other investments with real-time updates and portfolio performance analytics.',
      highlight: 'Portfolio tracking included',
    },
    {
      icon: BiShield,
      title: 'Priority Support & Training',
      description:
        '24/7 premium support with dedicated account manager and personalized financial coaching sessions.',
      highlight: '<2 hour response time',
    },
    {
      icon: BiDownload,
      title: 'Unlimited Data Export',
      description:
        'Export data in any format (CSV, Excel, PDF, QuickBooks) with advanced filtering and scheduling.',
      highlight: 'All formats supported',
    },
    {
      icon: BiCrown,
      title: 'Automation & Integrations',
      description:
        'Automated transaction imports, recurring transaction management, and integrations with popular financial tools.',
      highlight: 'Auto-sync included',
    },
  ];

  return (
    <Container background="accent" className="py-20" id="pricing">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary-accent text-primary-accent-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <BiCrown className="text-lg" />
          Premium Experience
        </div>
        <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Unlock Your Financial Superpowers
        </h3>
        <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed">
          Take your financial management to the next level with premium features
          designed for serious wealth builders and budget masters.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {premiumFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-primary-background p-6 rounded-2xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-accent/20 transition-colors">
                <feature.icon className="text-2xl text-primary-accent" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-primary-card-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-primary-text text-sm leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="text-xs font-medium text-primary-accent bg-primary-accent/10 px-2 py-1 rounded-full inline-block">
                  {feature.highlight}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pricing Card */}
      <div className="bg-primary-background p-8 rounded-3xl border border-primary-border shadow-2xl max-w-2xl mx-auto mb-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BiCrown className="text-2xl text-primary-accent" />
            <span className="text-sm font-semibold text-primary-accent bg-primary-accent/10 px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
          </div>
          <div className="text-5xl font-bold text-primary-accent mb-2">
            $4.99<span className="text-lg text-primary-text">/month</span>
          </div>
          <div className="text-primary-text">
            Cancel anytime • No setup fees • 30-day money-back guarantee
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <BiCheck className="text-green-500 text-xl flex-shrink-0" />
            <span className="text-primary-card-foreground">
              Everything in Free plan (unlimited)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BiCheck className="text-green-500 text-xl flex-shrink-0" />
            <span className="text-primary-card-foreground">
              Advanced analytics & predictive insights
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BiCheck className="text-green-500 text-xl flex-shrink-0" />
            <span className="text-primary-card-foreground">
              Investment portfolio tracking
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BiCheck className="text-green-500 text-xl flex-shrink-0" />
            <span className="text-primary-card-foreground">
              Priority customer support & coaching
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BiCheck className="text-green-500 text-xl flex-shrink-0" />
            <span className="text-primary-card-foreground">
              Unlimited data export & integrations
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BiCheck className="text-green-500 text-xl flex-shrink-0" />
            <span className="text-primary-card-foreground">
              Auto-sync & automation features
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link href="/auth/signup?plan=premium">
            <Button size="lg" className="w-full text-lg py-4 mb-4">
              <BiCrown className="mr-2 text-xl" />
              Start Premium Trial
            </Button>
          </Link>
          <p className="text-sm text-primary-text">
            30 days free • Upgrade or cancel anytime • No questions asked
          </p>
        </div>
      </div>

      {/* Enhanced Free vs Premium Comparison */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-primary-background/50 p-8 rounded-2xl border border-primary-border">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-primary-foreground mb-2">
              Free Plan
            </h4>
            <div className="text-3xl font-bold text-primary-accent mb-4">
              $0
            </div>
            <p className="text-primary-text/80">Perfect for getting started</p>
          </div>

          <div className="space-y-3 text-primary-text">
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Unlimited expense tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>5 budgets per month</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Community price sharing</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Basic analytics & reports</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Email support</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Offline access</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-accent/10 to-primary-accent/5 p-8 rounded-2xl border border-primary-accent/20 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <BiStar className="text-2xl text-primary-accent bg-primary-background rounded-full p-1" />
          </div>

          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-primary-foreground mb-2">
              Premium Plan
            </h4>
            <div className="text-3xl font-bold text-primary-accent mb-4">
              $4.99/mo
            </div>
            <p className="text-primary-text/80">For serious wealth builders</p>
          </div>

          <div className="space-y-3 text-primary-text">
            <div className="flex items-center gap-3">
              <BiHeart className="text-red-500 text-lg flex-shrink-0" />
              <span className="font-semibold">Everything in Free +</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Unlimited budgets & categories</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Advanced analytics & AI insights</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Investment portfolio tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Priority support & coaching</span>
            </div>
            <div className="flex items-center gap-3">
              <BiCheck className="text-green-500 text-lg flex-shrink-0" />
              <span>Auto-sync & unlimited exports</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
