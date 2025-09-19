import { Button } from '../ui/button';
import { BiRocket, BiHeart, BiTrendingUp, BiShield } from 'react-icons/bi';
import Link from 'next/link';
import Container from '../ui/container';

export default function CTASection() {
  return (
    <Container background="default" className="py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <BiRocket className="text-5xl text-primary-accent mx-auto mb-6" />
          <h3 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-primary-accent to-primary-accent/80 bg-clip-text text-transparent block">
              Financial Future?
            </span>
          </h3>
          <p className="text-xl md:text-2xl text-primary-text mb-8 leading-relaxed max-w-3xl mx-auto">
            Join 15,000+ users who have already taken control of their finances.
            Start your journey to financial freedom today - it&apos;s completely
            free!
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary-accent/10 p-6 rounded-2xl border border-primary-accent/20">
            <BiTrendingUp className="text-3xl text-primary-accent mx-auto mb-3" />
            <div className="font-semibold text-primary-foreground mb-1">
              Save Money
            </div>
            <div className="text-sm text-primary-text">Average $3,200/year</div>
          </div>
          <div className="bg-primary-accent/10 p-6 rounded-2xl border border-primary-accent/20">
            <BiShield className="text-3xl text-primary-accent mx-auto mb-3" />
            <div className="font-semibold text-primary-foreground mb-1">
              Enterprise Security
            </div>
            <div className="text-sm text-primary-text">
              Your data is protected
            </div>
          </div>
          <div className="bg-primary-accent/10 p-6 rounded-2xl border border-primary-accent/20">
            <BiHeart className="text-3xl text-primary-accent mx-auto mb-3" />
            <div className="font-semibold text-primary-foreground mb-1">
              Peace of Mind
            </div>
            <div className="text-sm text-primary-text">
              94% satisfaction rate
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="text-lg px-8 py-4 w-full sm:w-auto group"
            >
              <BiRocket className="mr-2 text-xl group-hover:animate-pulse" />
              Get Started Free
            </Button>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 w-full sm:w-auto border-2 hover:border-primary-accent"
            >
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="text-sm text-primary-muted-foreground">
          <p className="mb-4">
            ✨ No credit card required • Cancel anytime • 30-day free trial for
            premium
          </p>
          <p>
            Join thousands of users who trust Fine Life for their financial
            management
          </p>
        </div>
      </div>
    </Container>
  );
}
