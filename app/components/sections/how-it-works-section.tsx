import {
  BiPlus,
  BiBarChart,
  BiShare,
  BiCheck,
  BiWallet,
  BiAlbum,
  BiTrendingUp,
  BiHeart,
} from 'react-icons/bi';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import Container from '../ui/container';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: BiPlus,
      title: 'Track Every Penny',
      description:
        'Log expenses instantly with smart categorization. Capture receipts, split bills, and never miss a transaction. Our AI learns your spending patterns automatically.',
      color: 'from-blue-500 to-cyan-500',
      tip: 'Quick-add buttons for frequent purchases',
      delay: '0s',
    },
    {
      icon: BiBarChart,
      title: 'Visualize Your Money',
      description:
        'See beautiful charts and graphs of your spending. Identify trends, compare months, and understand where your money goes. Set personalized budgets that work for you.',
      color: 'from-green-500 to-emerald-500',
      tip: 'Monthly reports delivered to your inbox',
      delay: '0.2s',
    },
    {
      icon: BiShare,
      title: 'Join the Community',
      description:
        'Share prices anonymously to help others find deals. Compare local prices, discover trending costs, and make informed purchasing decisions together.',
      color: 'from-purple-500 to-pink-500',
      tip: 'See average prices for 10,000+ items',
      delay: '0.4s',
    },
    {
      icon: BiAlbum,
      title: 'Achieve Your Goals',
      description:
        'Set savings targets, track progress, and celebrate milestones. Get personalized tips to optimize your budget and reach financial freedom faster.',
      color: 'from-orange-500 to-red-500',
      tip: 'Gamified savings challenges',
      delay: '0.6s',
    },
  ];

  const benefits = [
    {
      icon: BiTrendingUp,
      label: 'Save Money',
      value: 'Average $3,200/year',
      color: 'text-green-500',
    },
    {
      icon: BiAlbum,
      label: 'Hit Goals',
      value: '89% success rate',
      color: 'text-blue-500',
    },
    {
      icon: BiHeart,
      label: 'Peace of Mind',
      value: '94% satisfaction',
      color: 'text-red-500',
    },
  ];

  return (
    <Container
      background="default"
      className="relative py-20 overflow-hidden"
      id="how-it-works"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-24 h-24 bg-primary-accent/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-32 right-24 w-20 h-20 bg-blue-500/10 rounded-full blur-lg animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-float-fast"></div>
        <div className="absolute bottom-24 right-16 w-16 h-16 bg-green-500/10 rounded-full blur-lg animate-float-slow"></div>
        <div className="absolute top-2/3 left-20 w-14 h-14 bg-yellow-500/10 rounded-full blur-md animate-float-medium"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-accent/10 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <FiZap className="text-primary-accent" />
            <span className="text-sm font-medium text-primary-accent">
              How It Works
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Your Financial Journey Starts Here
          </h2>
          <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Transform your relationship with money in just 4 simple steps. From
            tracking expenses to achieving your financial dreams.
          </p>
        </div>

        <div className="relative mb-16">
          {/* Connection Line Background */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-accent/20 via-primary-accent/40 to-primary-accent/20"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center group animate-slide-up"
                style={{ animationDelay: step.delay }}
              >
                {/* Step Number with Animation */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-primary-accent to-primary-accent/80 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-xl group-hover:scale-110 transition-transform duration-300 animate-pulse">
                  {index + 1}
                </div>

                {/* Icon with Enhanced Styling */}
                <div
                  className={`relative w-24 h-24 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden`}
                >
                  <step.icon className="text-4xl text-white group-hover:scale-110 transition-transform duration-300" />

                  {/* Floating particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping animation-delay-300"></div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-primary-foreground mb-4 group-hover:text-primary-accent transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-primary-text leading-relaxed mb-4 group-hover:text-primary-text/90 transition-colors duration-300">
                  {step.description}
                </p>

                {/* Enhanced Tip */}
                <div className="bg-gradient-to-r from-primary-accent/10 to-primary-accent/5 rounded-xl p-4 border border-primary-accent/20 group-hover:border-primary-accent/40 transition-colors duration-300">
                  <p className="text-sm text-primary-accent font-medium flex items-center justify-center gap-2">
                    <FiZap className="text-lg" />
                    {step.tip}
                  </p>
                </div>

                {/* Arrow for next step */}
                {index < steps.length - 1 && (
                  <div className="absolute top-24 -right-4 w-8 h-8 bg-primary-accent/20 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 lg:flex hidden">
                    <FiArrowRight className="text-primary-accent text-lg" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="bg-gradient-to-r from-primary-card/60 via-primary-accent/5 to-primary-card/60 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 shadow-xl animate-fade-in animation-delay-800">
          <div className="text-center">
            <div className="relative mb-6">
              <BiWallet className="text-5xl text-primary-accent mx-auto" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-accent rounded-full animate-ping"></div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Take Control of Your Finances?
            </h3>
            <p className="text-lg text-primary-text mb-8 max-w-2xl mx-auto">
              Join 15,000+ users who are already saving money, building wealth,
              and achieving their financial goals. It takes less than 5 minutes
              to get started.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className={`text-3xl ${benefit.color}`} />
                  </div>
                  <div className="font-semibold text-primary-foreground mb-1 group-hover:text-primary-accent transition-colors duration-300">
                    {benefit.label}
                  </div>
                  <div className="text-sm text-primary-text group-hover:text-primary-text/90 transition-colors duration-300">
                    {benefit.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-primary-text bg-primary-background/60 backdrop-blur-sm px-4 py-3 rounded-full border border-primary-border/50 hover:border-primary-accent/30 transition-colors duration-300">
                <BiCheck className="text-green-500" />
                <span>Free forever plan available</span>
              </div>
              <div className="flex items-center gap-2 text-primary-text bg-primary-background/60 backdrop-blur-sm px-4 py-3 rounded-full border border-primary-border/50 hover:border-primary-accent/30 transition-colors duration-300">
                <BiCheck className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-primary-text bg-primary-background/60 backdrop-blur-sm px-4 py-3 rounded-full border border-primary-border/50 hover:border-primary-accent/30 transition-colors duration-300">
                <BiCheck className="text-green-500" />
                <span>Cancel anytime, no fees</span>
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
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </Container>
  );
}
