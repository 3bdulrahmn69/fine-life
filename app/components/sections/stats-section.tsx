import {
  BiTrendingUp,
  BiDollar,
  BiUser,
  BiTrophy,
  BiChart,
  BiTime,
} from 'react-icons/bi';
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiAward,
  FiBarChart,
  FiClock,
} from 'react-icons/fi';
import Container from '../ui/container';

export default function StatsSection() {
  const stats = [
    {
      icon: BiUser,
      altIcon: FiUsers,
      value: '15,000+',
      label: 'Active Users',
      description: 'People managing their finances smarter every day',
      trend: '+23% this month',
      color: 'from-blue-500 to-blue-600',
      delay: '0s',
    },
    {
      icon: BiDollar,
      altIcon: FiDollarSign,
      value: '$3.2M+',
      label: 'Money Saved',
      description: 'Total savings reported by our community',
      trend: '$280K this month',
      color: 'from-green-500 to-green-600',
      delay: '0.1s',
    },
    {
      icon: BiTrendingUp,
      altIcon: FiTrendingUp,
      value: '89%',
      label: 'Budget Success',
      description: 'Users who consistently stay within their budgets',
      trend: '+5% vs last quarter',
      color: 'from-purple-500 to-purple-600',
      delay: '0.2s',
    },
    {
      icon: BiChart,
      altIcon: FiBarChart,
      value: '75K+',
      label: 'Transactions Tracked',
      description: 'Expenses and incomes logged monthly',
      trend: '2.1M total tracked',
      color: 'from-orange-500 to-orange-600',
      delay: '0.3s',
    },
    {
      icon: BiTime,
      altIcon: FiClock,
      value: '5 mins',
      label: 'Daily Time Saved',
      description: 'Average time users save on financial management',
      trend: 'Per user daily',
      color: 'from-teal-500 to-teal-600',
      delay: '0.4s',
    },
    {
      icon: BiTrophy,
      altIcon: FiAward,
      value: '4.9★',
      label: 'User Rating',
      description: 'Average rating across all platforms',
      trend: '500+ reviews',
      color: 'from-yellow-500 to-yellow-600',
      delay: '0.5s',
    },
  ];

  return (
    <Container
      id="stats"
      background="accent"
      className="relative py-20 overflow-hidden"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-accent/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500/10 rounded-full blur-lg animate-float-medium"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float-fast"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-green-500/10 rounded-full blur-lg animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-yellow-500/10 rounded-full blur-md animate-float-medium"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-accent/10 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <BiTrendingUp className="text-primary-accent" />
            <span className="text-sm font-medium text-primary-accent">
              Real Impact
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Numbers That Speak
          </h2>
          <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Real results from real users transforming their financial lives.
            Join a community that&apos;s already saving millions collectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-primary-card/50 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 hover:border-primary-accent/30 hover:shadow-2xl hover:shadow-primary-accent/10 transition-all duration-500 text-center overflow-hidden animate-slide-up"
              style={{ animationDelay: stat.delay }}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
              />

              {/* Floating icon animation */}
              <div className="absolute top-1 right-1 w-12 h-12 bg-primary-accent/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                <stat.altIcon className="text-lg text-primary-accent" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="text-4xl text-primary-accent group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-accent to-primary-accent/80 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>

                <div className="text-xl font-semibold text-primary-card-foreground mb-3 group-hover:text-primary-accent transition-colors duration-300">
                  {stat.label}
                </div>

                <div className="text-primary-text mb-4 leading-relaxed group-hover:text-primary-text/90 transition-colors duration-300">
                  {stat.description}
                </div>

                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-accent/10 to-primary-accent/5 px-4 py-2 rounded-full border border-primary-accent/20 group-hover:border-primary-accent/40 transition-colors duration-300">
                  <BiTrendingUp className="text-primary-accent text-sm" />
                  <span className="text-sm font-medium text-primary-accent">
                    {stat.trend}
                  </span>
                </div>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in animation-delay-1000">
          <p className="text-primary-text/80 mb-6">
            Ready to be part of these success stories?
          </p>
          <div className="inline-flex items-center gap-2 text-primary-accent font-medium">
            <span>Join 15,000+ users today</span>
            <BiTrendingUp className="text-lg" />
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
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </Container>
  );
}
