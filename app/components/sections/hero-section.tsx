import { Button } from '../ui/button';
import Container from '../ui/container';
import Link from 'next/link';
import { FiTrendingUp, FiUsers, FiTarget } from 'react-icons/fi';

export default function HeroSection() {
  return (
    <Container size="xl" padding="xl" className="text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
          Transform Your
          <span className="bg-gradient-to-r from-primary-accent to-primary-accent/80 bg-clip-text text-transparent block">
            Financial Life
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-primary-text mb-8 leading-relaxed max-w-3xl mx-auto">
          Take control of your finances with smart tracking, intelligent
          budgeting, and community-driven insights. Join thousands who are
          already building wealth systematically.
        </p>

        {/* Key Benefits */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base">
          <div className="flex items-center gap-2 text-primary-text">
            <FiTrendingUp className="text-primary-accent" />
            <span>Smart Analytics</span>
          </div>
          <div className="flex items-center gap-2 text-primary-text">
            <FiUsers className="text-primary-accent" />
            <span>Community Insights</span>
          </div>
          <div className="flex items-center gap-2 text-primary-text">
            <FiTarget className="text-primary-accent" />
            <span>Goal Tracking</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 w-full sm:w-auto"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="text-sm text-primary-muted-foreground">
          <p>
            Join 10,000+ users who trust Fine Life for their financial
            management
          </p>
        </div>
      </div>
    </Container>
  );
}
