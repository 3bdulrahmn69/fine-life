import { BiStar } from 'react-icons/bi';
import { FaQuoteLeft } from 'react-icons/fa';
import { FiHeart, FiTrendingUp, FiClock, FiAward } from 'react-icons/fi';

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
      icon: FiTrendingUp,
      delay: '0s',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content:
        "The smart budgeting features are incredible. I finally understand where my money goes. The app's predictions helped me avoid overspending multiple times this year.",
      rating: 5,
      avatar: 'MC',
      highlight: 'Predictive alerts',
      icon: FiHeart,
      delay: '0.1s',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Freelance Designer',
      content:
        'As a freelancer, tracking expenses was always a hassle. Fine Life made it effortless. The recurring transaction feature and automated categorization save me hours every month.',
      rating: 5,
      avatar: 'ER',
      highlight: '5+ hours saved/month',
      icon: FiClock,
      delay: '0.2s',
    },
    {
      name: 'David Thompson',
      role: 'Marketing Manager',
      content:
        'The analytics are top-notch. I can see spending trends at a glance. The community price sharing feature helped me find the best deals on business supplies and travel.',
      rating: 5,
      avatar: 'DT',
      highlight: 'Market insights',
      icon: FiAward,
      delay: '0.3s',
    },
  ];

  const trustStats = [
    {
      value: '15,000+',
      label: 'Happy Users',
      sublabel: 'Growing daily',
      icon: FiHeart,
    },
    {
      value: '$3.2M+',
      label: 'Money Saved',
      sublabel: 'Average $3,200/year',
      icon: FiTrendingUp,
    },
    {
      value: '4.9★',
      label: 'App Store Rating',
      sublabel: '500+ reviews',
      icon: FiAward,
    },
    {
      value: '24/7',
      label: 'Support Available',
      sublabel: 'Always here to help',
      icon: FiClock,
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-20 mt-8 overflow-hidden bg-gradient-to-br from-primary-card via-primary-background to-primary-accent/5"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-24 h-24 bg-primary-accent/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-32 right-24 w-20 h-20 bg-blue-500/10 rounded-full blur-lg animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-float-fast"></div>
        <div className="absolute bottom-24 right-16 w-16 h-16 bg-green-500/10 rounded-full blur-lg animate-float-slow"></div>
        <div className="absolute top-2/3 left-20 w-14 h-14 bg-yellow-500/10 rounded-full blur-md animate-float-medium"></div>
        <div className="absolute top-1/4 right-1/3 w-18 h-18 bg-pink-500/10 rounded-full blur-lg animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-accent/10 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <BiStar className="text-primary-accent" />
            <span className="text-sm font-medium text-primary-accent">
              User Stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-slide-up">
            What Our Users Say
          </h2>
          <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Join thousands of users who have transformed their financial lives
            with Fine Life. Real stories from real people achieving real
            results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-primary-card/60 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 hover:border-primary-accent/30 hover:shadow-2xl hover:shadow-primary-accent/10 transition-all duration-500 overflow-hidden animate-slide-up"
              style={{ animationDelay: testimonial.delay }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

              {/* Floating icon */}
              <div className="absolute top-0 right-0 w-10 h-10 bg-primary-accent/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                <testimonial.icon className="text-lg text-primary-accent" />
              </div>

              <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <BiStar
                        key={i}
                        className="text-yellow-400 text-lg fill-current group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-primary-accent bg-primary-accent/10 px-3 py-1 rounded-full border border-primary-accent/20 group-hover:bg-primary-accent/20 transition-colors duration-300">
                    {testimonial.highlight}
                  </span>
                </div>

                {/* Quote Icon */}
                <FaQuoteLeft className="text-primary-accent text-2xl mb-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />

                {/* Testimonial Content */}
                <p className="text-primary-text mb-6 leading-relaxed group-hover:text-primary-text/90 transition-colors duration-300">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* User Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-accent rounded-full flex items-center justify-center text-primary-accent-foreground font-semibold mr-4 text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-primary-card-foreground group-hover:text-primary-accent transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-primary-text/80 group-hover:text-primary-text/70 transition-colors duration-300">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="bg-primary-card/40 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 shadow-xl animate-fade-in animation-delay-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustStats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-2xl text-primary-accent" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary-accent to-primary-accent/80 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-primary-text font-medium mb-1 group-hover:text-primary-accent transition-colors duration-300">
                  {stat.label}
                </div>
                <div className="text-sm text-primary-text/70 group-hover:text-primary-text/80 transition-colors duration-300">
                  {stat.sublabel}
                </div>
              </div>
            ))}
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
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </section>
  );
}
