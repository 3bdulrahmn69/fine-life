import {
  FiDollarSign,
  FiPieChart,
  FiUsers,
  FiTarget,
  FiSmartphone,
  FiShield,
  FiTrendingUp,
  FiBell,
} from 'react-icons/fi';
import Container from '../ui/container';

export default function FeaturesSection() {
  return (
    <Container background="card" className="py-20" id="features">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Everything You Need to Succeed
        </h3>
        <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed">
          Powerful features designed to make financial management effortless,
          effective, and even enjoyable. Built for modern life.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-primary-background p-8 rounded-xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-accent/20 transition-colors">
            <FiDollarSign className="text-3xl text-primary-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary-card-foreground mb-4">
            Smart Expense Tracking
          </h4>
          <p className="text-primary-text leading-relaxed">
            Effortlessly track every expense with AI-powered categorization,
            receipt scanning, and automatic merchant detection.
          </p>
        </div>

        <div className="bg-primary-background p-8 rounded-xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-accent/20 transition-colors">
            <FiTarget className="text-3xl text-primary-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary-card-foreground mb-4">
            Intelligent Budgeting
          </h4>
          <p className="text-primary-text leading-relaxed">
            Set smart budgets that adapt to your lifestyle with predictive
            analytics and get proactive alerts before overspending.
          </p>
        </div>

        <div className="bg-primary-background p-8 rounded-xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-accent/20 transition-colors">
            <FiPieChart className="text-3xl text-primary-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary-card-foreground mb-4">
            Advanced Analytics
          </h4>
          <p className="text-primary-text leading-relaxed">
            Beautiful insights and comprehensive reports that help you
            understand spending patterns and identify opportunities.
          </p>
        </div>

        <div className="bg-primary-background p-8 rounded-xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-accent/20 transition-colors">
            <FiUsers className="text-3xl text-primary-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary-card-foreground mb-4">
            Community Insights
          </h4>
          <p className="text-primary-text leading-relaxed">
            Compare prices and learn from a global community of smart spenders.
            See real-time market trends and local pricing data.
          </p>
        </div>

        <div className="bg-primary-background p-8 rounded-xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-accent/20 transition-colors">
            <FiSmartphone className="text-3xl text-primary-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary-card-foreground mb-4">
            Mobile First PWA
          </h4>
          <p className="text-primary-text leading-relaxed">
            Native app experience on any device with offline support, push
            notifications, and seamless cross-device synchronization.
          </p>
        </div>

        <div className="bg-primary-background p-8 rounded-xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-accent/20 transition-colors">
            <FiShield className="text-3xl text-primary-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary-card-foreground mb-4">
            Enterprise Security
          </h4>
          <p className="text-primary-text leading-relaxed">
            Your financial data is protected with enterprise-grade encryption,
            secure authentication, and privacy-first design principles.
          </p>
        </div>
      </div>

      {/* Additional Features Row */}
      <div className="mt-16 grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-r from-primary-accent/5 to-primary-accent/10 p-8 rounded-xl border border-primary-accent/20">
          <div className="flex items-center gap-4 mb-4">
            <FiTrendingUp className="text-2xl text-primary-accent" />
            <h4 className="text-xl font-semibold text-primary-foreground">
              Predictive Analytics
            </h4>
          </div>
          <p className="text-primary-text">
            AI-powered insights that predict your spending patterns and help you
            make better financial decisions before it&apos;s too late.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary-accent/5 to-primary-accent/10 p-8 rounded-xl border border-primary-accent/20">
          <div className="flex items-center gap-4 mb-4">
            <FiBell className="text-2xl text-primary-accent" />
            <h4 className="text-xl font-semibold text-primary-foreground">
              Smart Notifications
            </h4>
          </div>
          <p className="text-primary-text">
            Intelligent alerts for budget limits, unusual spending, bill
            reminders, and personalized financial tips delivered at the right
            time.
          </p>
        </div>
      </div>
    </Container>
  );
}
