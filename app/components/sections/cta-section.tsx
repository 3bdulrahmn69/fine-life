import { Button } from '../ui/button';
import { BiRocket, BiHeart, BiTrendingUp, BiShield } from 'react-icons/bi';
import { FiStar, FiZap, FiCheck } from 'react-icons/fi';
import Link from 'next/link';
import Container from '../ui/container';

export default function CTASection() {
  const benefits = [
    {
      icon: BiTrendingUp,
      title: 'Save Money',
      subtitle: 'Average $3,200/year',
      color: 'from-green-500 to-green-600',
      delay: '0s',
    },
    {
      icon: BiShield,
      title: 'Enterprise Security',
      subtitle: 'Your data is protected',
      color: 'from-blue-500 to-blue-600',
      delay: '0.1s',
    },
    {
      icon: BiHeart,
      title: 'Peace of Mind',
      subtitle: '94% satisfaction rate',
      color: 'from-purple-500 to-purple-600',
      delay: '0.2s',
    },
  ];

  return (
    <Container
      id="cta"
      background="default"
      className="relative py-24 overflow-hidden"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-accent/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-float-fast"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-green-500/10 rounded-full blur-lg animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-yellow-500/10 rounded-full blur-md animate-float-medium"></div>
        <div className="absolute top-1/4 right-1/3 w-18 h-18 bg-pink-500/10 rounded-full blur-lg animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-accent/10 px-4 py-2 rounded-full mb-8">
              <FiStar className="text-primary-accent" />
              <span className="text-sm font-medium text-primary-accent">
                Start Your Journey
              </span>
            </div>

            <div className="relative mb-8">
              <BiRocket className="text-6xl text-primary-accent mx-auto mb-6 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-accent rounded-full animate-ping"></div>
            </div>

            <h2 className="text-4xl md:text-7xl font-bold text-primary-foreground mb-8 leading-tight animate-slide-up">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-primary-accent via-primary-accent/90 to-primary-accent/80 bg-clip-text text-transparent block animate-gradient-x">
                Financial Future?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-primary-text mb-12 leading-relaxed max-w-4xl mx-auto animate-slide-up animation-delay-200">
              Join 15,000+ users who have already taken control of their
              finances. Start your journey to financial freedom today -
              it&apos;s completely free!
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative bg-primary-card/60 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 hover:border-primary-accent/30 hover:shadow-2xl hover:shadow-primary-accent/10 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: benefit.delay }}
              >
                {/* Animated background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="text-4xl text-primary-accent" />
                  </div>
                  <div className="font-bold text-primary-foreground mb-2 text-lg group-hover:text-primary-accent transition-colors duration-300">
                    {benefit.title}
                  </div>
                  <div className="text-primary-text group-hover:text-primary-text/90 transition-colors duration-300">
                    {benefit.subtitle}
                  </div>
                </div>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in animation-delay-600">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="text-lg px-10 py-5 w-full sm:w-auto group relative overflow-hidden shadow-2xl hover:shadow-primary-accent/25 transition-all duration-300"
                aria-label="Start your free Fine Life account"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <BiRocket className="mr-3 text-xl group-hover:-translate-y-8 group-hover:translate-x-8 group-hover:opacity-0 duration-300 " />
                <span className="relative z-10">Get Started Free</span>
                <FiZap className="ml-3 text-lg opacity-0 group-hover:opacity-100 transition-opacity group-hover:animate-pulse duration-300" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-5 w-full sm:w-auto border-2 hover:border-primary-accent hover:bg-primary-accent/5 transition-all duration-300 group"
                aria-label="Explore Fine Life features"
              >
                <span className="group-hover:text-primary-accent transition-colors duration-300">
                  Explore Features
                </span>
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="bg-primary-card/40 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 animate-fade-in animation-delay-800">
            <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-primary-accent">
                <FiCheck className="text-lg" />
                <span className="text-sm font-medium">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary-accent">
                <FiCheck className="text-lg" />
                <span className="text-sm font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-primary-accent">
                <FiCheck className="text-lg" />
                <span className="text-sm font-medium">
                  30-day free trial for premium
                </span>
              </div>
            </div>
            <p className="text-primary-text/80">
              Join thousands of users who trust Fine Life for their financial
              management
            </p>
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
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
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
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
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
