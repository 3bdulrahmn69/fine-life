import { FiTrendingUp, FiZap, FiTarget, FiSmile } from 'react-icons/fi';
import { BiHeart, BiTrophy } from 'react-icons/bi';
import Container from '../ui/container';

export default function BenefitsSection() {
  return (
    <Container background="accent" className="py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            More Than Just Tracking
          </h3>
          <p className="text-xl text-primary-text mb-10 leading-relaxed">
            Fine Life transforms how you think about money and helps you build
            lasting financial habits that create real, measurable change in your
            life. It&apos;s not just an app—it&apos;s your financial coach.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-primary-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiTrendingUp className="text-xl text-primary-accent" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-primary-card-foreground mb-3">
                  Build Wealth Systematically
                </h4>
                <p className="text-primary-text leading-relaxed">
                  Turn your financial goals into achievable milestones with
                  personalized strategies, automated savings, and progress
                  tracking that keeps you motivated.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-primary-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiZap className="text-xl text-primary-accent" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-primary-card-foreground mb-3">
                  Save Time & Reduce Stress
                </h4>
                <p className="text-primary-text leading-relaxed">
                  Automate your financial management with smart categorization,
                  recurring transaction tracking, and proactive budget alerts
                  that prevent surprises.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-primary-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiTarget className="text-xl text-primary-accent" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-primary-card-foreground mb-3">
                  Achieve Your Dreams
                </h4>
                <p className="text-primary-text leading-relaxed">
                  Whether it&apos;s buying a home, traveling the world, or
                  starting a business, Fine Life helps you turn financial dreams
                  into reality with clear roadmaps and progress tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-primary-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiSmile className="text-xl text-primary-accent" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-primary-card-foreground mb-3">
                  Live Your Best Life
                </h4>
                <p className="text-primary-text leading-relaxed">
                  Make confident financial decisions that align with your values
                  and dreams. Experience the peace of mind that comes with
                  financial clarity and control.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Success Story Card */}
          <div className="bg-primary-background p-8 rounded-2xl border border-primary-border shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary-accent/10 rounded-full flex items-center justify-center">
                <BiTrophy className="text-2xl text-primary-accent" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-primary-card-foreground">
                  Success Stories
                </h4>
                <p className="text-primary-text/80">
                  Real results from real users
                </p>
              </div>
            </div>

            <blockquote className="text-lg text-primary-text mb-6 leading-relaxed">
              &ldquo;Fine Life helped me save $8,200 in just 8 months and
              finally understand where my money was going. It transformed my
              relationship with money completely!&rdquo;
            </blockquote>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-primary-card-foreground">
                  Sarah M.
                </p>
                <p className="text-sm text-primary-text/70">
                  Marketing Manager
                </p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-primary-accent/10 to-primary-accent/5 p-8 rounded-2xl border border-primary-accent/20">
            <div className="text-center">
              <BiHeart className="text-4xl text-primary-accent mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-primary-foreground mb-2">
                Join 15,000+ Happy Users
              </h4>
              <p className="text-primary-text mb-4">
                Average savings:{' '}
                <span className="font-semibold text-primary-accent">
                  $3,200/year
                </span>
              </p>
              <p className="text-sm text-primary-text/80">
                94% of users report improved financial confidence
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
