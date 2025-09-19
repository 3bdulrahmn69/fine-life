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
import Container from '../ui/container';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      icon: BiShield,
      question: 'How secure is my financial data with Fine Life?',
      answer:
        'Your security is our top priority. We use enterprise-level encryption (AES-256), secure authentication with NextAuth.js, and regular security audits. Your data is stored on encrypted servers and never shared with third parties. We comply with GDPR and CCPA privacy regulations.',
      category: 'Security',
    },
    {
      icon: BiLock,
      question: 'Is Fine Life really free? What are the limitations?',
      answer:
        'Yes! Our free plan includes unlimited expense tracking, 5 budgets, community price sharing, basic analytics, and offline access. Premium features like unlimited budgets, advanced analytics, and priority support are available for $4.99/month. No hidden fees or credit card required to start.',
      category: 'Pricing',
    },
    {
      icon: BiSync,
      question: 'Can I use Fine Life offline and across multiple devices?',
      answer:
        'Absolutely! Fine Life is a PWA that works offline. Add expenses, view budgets, and access recent data without internet. Everything syncs automatically when you reconnect. Your data is available on any device - phone, tablet, or desktop - with real-time synchronization.',
      category: 'Features',
    },
    {
      icon: BiHelpCircle,
      question: 'How does the community price sharing feature work?',
      answer:
        'When you add an expense, you can optionally share the price anonymously with the community. This helps everyone find better deals and track market trends. Only item names, prices, and general location data are shared - never your personal information or account details.',
      category: 'Community',
    },
    {
      icon: BiExport,
      question: 'Can I export my financial data for taxes or backups?',
      answer:
        'Yes! Export your data in multiple formats: CSV for spreadsheets, Excel for analysis, or PDF reports for sharing. Premium users get unlimited exports. Perfect for tax preparation, financial planning, or simply keeping secure backups of your financial records.',
      category: 'Data',
    },
    {
      icon: BiMobile,
      question: 'What devices and browsers does Fine Life support?',
      answer:
        "Fine Life works on any modern device with a web browser. It's fully responsive and optimized for mobile, tablet, and desktop. Install it as a PWA on your phone for a native app experience with offline access, push notifications, and home screen icon.",
      category: 'Technical',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Container background="card" className="py-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Your Questions, Answered
        </h3>
        <p className="text-xl text-primary-text max-w-3xl mx-auto leading-relaxed">
          Everything you need to know about managing your finances with Fine
          Life. From security to features, we&apos;ve got you covered.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-6 bg-primary-background rounded-2xl border border-primary-border overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-primary-accent/5 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <faq.icon className="text-xl text-primary-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary-card-foreground pr-4">
                    {faq.question}
                  </h4>
                  <span className="text-xs text-primary-accent bg-primary-accent/10 px-2 py-1 rounded-full font-medium">
                    {faq.category}
                  </span>
                </div>
              </div>
              {openIndex === index ? (
                <BiChevronUp className="text-primary-accent text-xl flex-shrink-0" />
              ) : (
                <BiChevronDown className="text-primary-accent text-xl flex-shrink-0" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-6 pb-6 border-t border-primary-border/50">
                <p className="text-primary-text leading-relaxed pt-4">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Contact CTA */}
      <div className="mt-16">
        <div className="bg-gradient-to-r from-primary-accent/10 to-primary-accent/5 p-8 rounded-3xl border border-primary-accent/20 text-center">
          <BiHelpCircle className="text-4xl text-primary-accent mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-primary-foreground mb-4">
            Still Have Questions?
          </h4>
          <p className="text-primary-text mb-6 max-w-2xl mx-auto">
            Our friendly support team is here to help you succeed with Fine
            Life. Get personalized assistance for your financial journey.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-accent mb-1">
                24/7
              </div>
              <div className="text-sm text-primary-text">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-accent mb-1">
                &lt;2hrs
              </div>
              <div className="text-sm text-primary-text">Average Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-accent mb-1">
                95%
              </div>
              <div className="text-sm text-primary-text">Satisfaction Rate</div>
            </div>
          </div>

          <div className="text-primary-accent font-semibold text-lg">
            📧 support@finelife.com
          </div>
          <div className="text-sm text-primary-text mt-2">
            We typically respond within 2 hours during business days
          </div>
        </div>
      </div>
    </Container>
  );
}
