import { BiStar } from 'react-icons/bi';
import { FaQuoteLeft } from 'react-icons/fa';
import Container from '../ui/container';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content:
        'Fine Life transformed how I manage my business expenses. The community insights helped me negotiate better prices with suppliers. I saved $2,500 in the first month alone!',
      rating: 5,
      avatar: 'SJ',
      highlight: '$2,500 saved',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content:
        "The smart budgeting features are incredible. I finally understand where my money goes. The app's predictions helped me avoid overspending multiple times this year.",
      rating: 5,
      avatar: 'MC',
      highlight: 'Predictive alerts',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Freelance Designer',
      content:
        'As a freelancer, tracking expenses was always a hassle. Fine Life made it effortless. The recurring transaction feature and automated categorization save me hours every month.',
      rating: 5,
      avatar: 'ER',
      highlight: '5+ hours saved/month',
    },
    {
      name: 'David Thompson',
      role: 'Marketing Manager',
      content:
        'The analytics are top-notch. I can see spending trends at a glance. The community price sharing feature helped me find the best deals on business supplies and travel.',
      rating: 5,
      avatar: 'DT',
      highlight: 'Market insights',
    },
  ];

  return (
    <Container background="card" className="py-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          What Our Users Say
        </h3>
        <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed">
          Join thousands of users who have transformed their financial lives
          with Fine Life. Real stories from real people achieving real results.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-primary-background p-8 rounded-2xl border border-primary-border hover:shadow-xl hover:border-primary-accent/30 transition-all duration-300 group"
          >
            {/* Rating Stars */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <BiStar
                    key={i}
                    className="text-yellow-400 text-lg fill-current"
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-primary-accent bg-primary-accent/10 px-2 py-1 rounded-full">
                {testimonial.highlight}
              </span>
            </div>

            {/* Quote Icon */}
            <FaQuoteLeft className="text-primary-accent text-2xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Testimonial Content */}
            <p className="text-primary-text mb-6 leading-relaxed">
              &ldquo;{testimonial.content}&rdquo;
            </p>

            {/* User Info */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-accent rounded-full flex items-center justify-center text-primary-accent-foreground font-semibold mr-4 text-sm">
                {testimonial.avatar}
              </div>
              <div>
                <div className="font-semibold text-primary-card-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-primary-text/80">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Trust Indicators */}
      <div className="bg-primary-background/50 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-accent mb-2">
              15,000+
            </div>
            <div className="text-primary-text font-medium">Happy Users</div>
            <div className="text-sm text-primary-text/70 mt-1">
              Growing daily
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-accent mb-2">
              $3.2M+
            </div>
            <div className="text-primary-text font-medium">Money Saved</div>
            <div className="text-sm text-primary-text/70 mt-1">
              Average $3,200/year
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-accent mb-2">
              4.9★
            </div>
            <div className="text-primary-text font-medium">
              App Store Rating
            </div>
            <div className="text-sm text-primary-text/70 mt-1">
              500+ reviews
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-accent mb-2">
              24/7
            </div>
            <div className="text-primary-text font-medium">
              Support Available
            </div>
            <div className="text-sm text-primary-text/70 mt-1">
              Always here to help
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
