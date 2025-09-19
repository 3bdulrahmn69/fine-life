import {
  BiTrendingUp,
  BiDollar,
  BiUser,
  BiTrophy,
  BiChart,
  BiTime,
} from 'react-icons/bi';
import Container from '../ui/container';

export default function StatsSection() {
  const stats = [
    {
      icon: BiUser,
      value: '15,000+',
      label: 'Active Users',
      description: 'People managing their finances smarter every day',
      trend: '+23% this month',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BiDollar,
      value: '$3.2M+',
      label: 'Money Saved',
      description: 'Total savings reported by our community',
      trend: '$280K this month',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: BiTrendingUp,
      value: '89%',
      label: 'Budget Success',
      description: 'Users who consistently stay within their budgets',
      trend: '+5% vs last quarter',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: BiChart,
      value: '75K+',
      label: 'Transactions Tracked',
      description: 'Expenses and incomes logged monthly',
      trend: '2.1M total tracked',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: BiTime,
      value: '5 mins',
      label: 'Daily Time Saved',
      description: 'Average time users save on financial management',
      trend: 'Per user daily',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: BiTrophy,
      value: '4.9★',
      label: 'User Rating',
      description: 'Average rating across all platforms',
      trend: '500+ reviews',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <Container background="accent" className="py-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Numbers That Speak
        </h3>
        <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed">
          Real results from real users transforming their financial lives. Join
          a community that&apos;s already saving millions collectively.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-primary-background p-8 rounded-2xl border border-primary-border hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center group relative overflow-hidden"
          >
            {/* Background gradient on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-accent/20 transition-colors">
                <stat.icon className="text-3xl text-primary-accent" />
              </div>

              <div className="text-4xl md:text-5xl font-bold text-primary-accent mb-3">
                {stat.value}
              </div>

              <div className="text-xl font-semibold text-primary-card-foreground mb-3">
                {stat.label}
              </div>

              <div className="text-primary-text mb-4 leading-relaxed">
                {stat.description}
              </div>

              <div className="text-sm font-medium text-primary-accent bg-primary-accent/10 px-3 py-1 rounded-full inline-block">
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
