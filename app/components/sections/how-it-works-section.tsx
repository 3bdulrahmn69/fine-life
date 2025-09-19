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
    },
    {
      icon: BiBarChart,
      title: 'Visualize Your Money',
      description:
        'See beautiful charts and graphs of your spending. Identify trends, compare months, and understand where your money goes. Set personalized budgets that work for you.',
      color: 'from-green-500 to-emerald-500',
      tip: 'Monthly reports delivered to your inbox',
    },
    {
      icon: BiShare,
      title: 'Join the Community',
      description:
        'Share prices anonymously to help others find deals. Compare local prices, discover trending costs, and make informed purchasing decisions together.',
      color: 'from-purple-500 to-pink-500',
      tip: 'See average prices for 10,000+ items',
    },
    {
      icon: BiAlbum,
      title: 'Achieve Your Goals',
      description:
        'Set savings targets, track progress, and celebrate milestones. Get personalized tips to optimize your budget and reach financial freedom faster.',
      color: 'from-orange-500 to-red-500',
      tip: 'Gamified savings challenges',
    },
  ];

  return (
    <Container background="default" className="py-20" id="how-it-works">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Your Financial Journey Starts Here
        </h3>
        <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed">
          Transform your relationship with money in just 4 simple steps. From
          tracking expenses to achieving your financial dreams.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {steps.map((step, index) => (
          <div key={index} className="relative text-center group">
            {/* Step Number */}
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-accent text-primary-accent-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
              {index + 1}
            </div>

            {/* Icon */}
            <div
              className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
            >
              <step.icon className="text-3xl text-white" />
            </div>

            {/* Content */}
            <h4 className="text-xl font-semibold text-primary-foreground mb-4">
              {step.title}
            </h4>
            <p className="text-primary-text leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Tip */}
            <div className="bg-primary-accent/10 rounded-lg p-3">
              <p className="text-sm text-primary-accent font-medium">
                💡 {step.tip}
              </p>
            </div>

            {/* Connection Line (hidden on mobile, visible on larger screens) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-accent to-transparent transform -translate-x-8"></div>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Call to Action */}
      <div className="bg-gradient-to-r from-primary-accent/10 to-primary-accent/5 p-8 rounded-3xl border border-primary-accent/20">
        <div className="text-center">
          <BiWallet className="text-4xl text-primary-accent mx-auto mb-4" />
          <h4 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to Take Control of Your Finances?
          </h4>
          <p className="text-lg text-primary-text mb-8 max-w-2xl mx-auto">
            Join 15,000+ users who are already saving money, building wealth,
            and achieving their financial goals. It takes less than 5 minutes to
            get started.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <BiTrendingUp className="text-2xl text-green-500 mx-auto mb-2" />
              <div className="font-semibold text-primary-foreground">
                Save Money
              </div>
              <div className="text-sm text-primary-text">
                Average $3,200/year
              </div>
            </div>
            <div className="text-center">
              <BiAlbum className="text-2xl text-blue-500 mx-auto mb-2" />
              <div className="font-semibold text-primary-foreground">
                Hit Goals
              </div>
              <div className="text-sm text-primary-text">89% success rate</div>
            </div>
            <div className="text-center">
              <BiHeart className="text-2xl text-red-500 mx-auto mb-2" />
              <div className="font-semibold text-primary-foreground">
                Peace of Mind
              </div>
              <div className="text-sm text-primary-text">94% satisfaction</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-primary-text bg-primary-background/50 px-3 py-2 rounded-full">
              <BiCheck className="text-green-500" />
              <span>Free forever plan available</span>
            </div>
            <div className="flex items-center gap-2 text-primary-text bg-primary-background/50 px-3 py-2 rounded-full">
              <BiCheck className="text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-primary-text bg-primary-background/50 px-3 py-2 rounded-full">
              <BiCheck className="text-green-500" />
              <span>Cancel anytime, no fees</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
