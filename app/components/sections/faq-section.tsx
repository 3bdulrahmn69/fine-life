'use client';

import { useState } from 'react';
import {
  BiChevronDown,
  BiChevronUp,
  BiShield,
  BiLock,
  BiSync,
  BiExport,
  BiMobile,
  BiHelpCircle,
} from 'react-icons/bi';
import { FiHelpCircle, FiMail, FiClock, FiCheckCircle } from 'react-icons/fi';
import Container from '../ui/container';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      icon: BiShield,
      altIcon: FiCheckCircle,
      question: 'How secure is my financial data with Fine Life?',
      answer:
        'Your security is our top priority. We use enterprise-level encryption (AES-256), secure authentication with NextAuth.js, and regular security audits. Your data is stored on encrypted servers and never shared with third parties. We comply with GDPR and CCPA privacy regulations.',
      category: 'Security',
      color: 'from-blue-500 to-cyan-500',
      delay: '0s',
    },
    {
      icon: BiLock,
      altIcon: FiCheckCircle,
      question: 'Is Fine Life really free? What are the limitations?',
      answer:
        'Yes! Our free plan includes unlimited expense tracking, 5 budgets, community price sharing, basic analytics, and cross-device sync. Premium features like unlimited budgets, advanced analytics, and priority support are available for $4.99/month. No hidden fees or credit card required to start.',
      category: 'Pricing',
      color: 'from-green-500 to-emerald-500',
      delay: '0.1s',
    },
    {
      icon: BiSync,
      altIcon: FiCheckCircle,
      question: 'Can I use Fine Life across multiple devices?',
      answer:
        'Absolutely! Fine Life provides seamless multi-device synchronization. Your data is available on any device - phone, tablet, or desktop - with real-time synchronization across all platforms.',
      category: 'Features',
      color: 'from-purple-500 to-pink-500',
      delay: '0.2s',
    },
    {
      icon: BiHelpCircle,
      altIcon: FiCheckCircle,
      question: 'How does the community price sharing feature work?',
      answer:
        'When you add an expense, you can optionally share the price anonymously with the community. This helps everyone find better deals and track market trends. Only item names, prices, and general location data are shared - never your personal information or account details.',
      category: 'Community',
      color: 'from-orange-500 to-red-500',
      delay: '0.3s',
    },
    {
      icon: BiExport,
      altIcon: FiCheckCircle,
      question: 'Can I export my financial data for taxes or backups?',
      answer:
        'Yes! Export your data in multiple formats: CSV for spreadsheets, Excel for analysis, or PDF reports for sharing. Premium users get unlimited exports. Perfect for tax preparation, financial planning, or simply keeping secure backups of your financial records.',
      category: 'Data',
      color: 'from-teal-500 to-cyan-500',
      delay: '0.4s',
    },
    {
      icon: BiMobile,
      altIcon: FiCheckCircle,
      question: 'What devices and browsers does Fine Life support?',
      answer:
        "Fine Life works on any modern device with a web browser. It's fully responsive and optimized for mobile, tablet, and desktop, providing a smooth user experience across all platforms.",
      category: 'Technical',
      color: 'from-indigo-500 to-purple-500',
      delay: '0.5s',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const supportStats = [
    { icon: FiClock, value: '24/7', label: 'Support Available' },
    { icon: FiMail, value: '<2hrs', label: 'Average Response' },
    { icon: FiCheckCircle, value: '95%', label: 'Satisfaction Rate' },
  ];

  return (
    <Container
      id="faq"
      background="card"
      className="relative py-20 overflow-hidden"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-24 h-24 bg-primary-accent/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-32 right-24 w-20 h-20 bg-blue-500/10 rounded-full blur-lg animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-float-fast"></div>
        <div className="absolute bottom-24 right-16 w-16 h-16 bg-green-500/10 rounded-full blur-lg animate-float-slow"></div>
        <div className="absolute top-2/3 left-20 w-14 h-14 bg-yellow-500/10 rounded-full blur-md animate-float-medium"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-accent/10 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <FiHelpCircle className="text-primary-accent" />
            <span className="text-sm font-medium text-primary-accent">FAQ</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Your Questions, Answered
          </h2>
          <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Everything you need to know about managing your finances with Fine
            Life. From security to features, we&apos;ve got you covered.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-6 bg-primary-card/60 backdrop-blur-sm rounded-3xl border border-primary-border/50 overflow-hidden hover:shadow-2xl hover:shadow-primary-accent/10 transition-all duration-500 animate-slide-up"
              style={{ animationDelay: faq.delay }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-primary-accent/5 transition-all duration-300 group"
                aria-expanded={openIndex === index}
                aria-controls={`faq-panel-${index}`}
                aria-label={`${faq.question} - ${
                  openIndex === index ? 'Collapse' : 'Expand'
                } answer`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <faq.icon className="text-2xl text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-card-foreground pr-4 group-hover:text-primary-accent transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <span className="text-xs font-medium text-primary-accent bg-primary-accent/10 px-3 py-1 rounded-full border border-primary-accent/20 group-hover:bg-primary-accent/20 transition-colors duration-300">
                      {faq.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {openIndex === index && (
                    <div className="w-8 h-8 bg-primary-accent/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <faq.altIcon className="text-primary-accent text-sm" />
                    </div>
                  )}
                  {openIndex === index ? (
                    <BiChevronUp className="text-primary-accent text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <BiChevronDown className="text-primary-accent text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div
                  id={`faq-panel-${index}`}
                  className="px-6 pb-6 border-t border-primary-border/50 animate-fade-in"
                >
                  <p className="text-primary-text leading-relaxed pt-4 group-hover:text-primary-text/90 transition-colors duration-300">
                    {faq.answer}
                  </p>
                </div>
              )}

              {/* Subtle glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${faq.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl -z-10 blur-xl`}
              ></div>
            </div>
          ))}
        </div>

        {/* Enhanced Contact CTA */}
        <div className="mt-16 bg-primary-card/40 backdrop-blur-sm p-8 rounded-3xl border border-primary-border/50 shadow-xl animate-fade-in animation-delay-800">
          <div className="text-center">
            <div className="relative mb-6">
              <BiHelpCircle className="text-5xl text-primary-accent mx-auto" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-accent rounded-full animate-ping"></div>
            </div>

            <h3 className="text-2xl font-bold text-primary-foreground mb-4">
              Still Have Questions?
            </h3>
            <p className="text-primary-text mb-8 max-w-2xl mx-auto">
              Our friendly support team is here to help you succeed with Fine
              Life. Get personalized assistance for your financial journey.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {supportStats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-accent/20 to-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="text-3xl text-primary-accent" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-accent to-primary-accent/80 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-primary-text group-hover:text-primary-text/90 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-accent/10 backdrop-blur-sm p-6 rounded-2xl border border-primary-accent/20">
              <div className="text-primary-accent font-semibold text-xl mb-2 flex items-center justify-center gap-2">
                <FiMail className="text-2xl" />
                support@finelife.com
              </div>
              <div className="text-primary-text/80">
                We typically respond within 2 hours during business days
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
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </Container>
  );
}
