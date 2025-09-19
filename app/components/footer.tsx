import {
  BiHeart,
  BiEnvelope,
  BiPhone,
  BiMapPin,
  BiLogoTwitter,
  BiLogoLinkedin,
  BiLogoGithub,
  BiShield,
} from 'react-icons/bi';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Security', href: '#security' },
      { name: 'API', href: '/api' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    community: [
      { name: 'Community Forum', href: '/community' },
      { name: 'Price Sharing', href: '/prices' },
      { name: 'Success Stories', href: '/stories' },
      { name: 'Newsletter', href: '/newsletter' },
    ],
  };

  const socialLinks = [
    {
      name: 'Twitter',
      icon: BiLogoTwitter,
      href: 'https://twitter.com/finelife',
    },
    {
      name: 'LinkedIn',
      icon: BiLogoLinkedin,
      href: 'https://linkedin.com/company/finelife',
    },
    { name: 'GitHub', icon: BiLogoGithub, href: 'https://github.com/finelife' },
  ];

  return (
    <footer className="bg-primary-card/30 border-t border-primary-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
                <BiHeart className="text-2xl text-primary-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-foreground">
                  Fine Life
                </h3>
                <p className="text-sm text-primary-muted-foreground">
                  Smart Finance Management
                </p>
              </div>
            </div>
            <p className="text-primary-text mb-6 leading-relaxed">
              Transforming lives through smart financial management. Join
              thousands who are building wealth and achieving financial freedom.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-primary-text">
                <BiEnvelope className="text-primary-accent flex-shrink-0" />
                <span>support@finelife.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-text">
                <BiPhone className="text-primary-accent flex-shrink-0" />
                <span>1-800-FINE-LIFE</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-text">
                <BiMapPin className="text-primary-accent flex-shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-text hover:text-primary-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-text hover:text-primary-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-text hover:text-primary-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">
              Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-text hover:text-primary-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-primary-background/50 p-6 rounded-2xl border border-primary-border mb-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-primary-foreground mb-2">
              Stay Updated
            </h4>
            <p className="text-primary-text mb-4">
              Get the latest financial tips and product updates delivered to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-primary-border bg-primary-background text-primary-foreground placeholder:text-primary-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-accent"
              />
              <button className="px-6 py-2 bg-primary-accent text-primary-accent-foreground rounded-lg hover:bg-primary-accent/90 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-primary-border">
          <div className="flex items-center gap-4 text-sm text-primary-text">
            <div className="flex items-center gap-2">
              <BiShield className="text-primary-accent" />
              <span>SOC 2 Certified</span>
            </div>
            <span>•</span>
            <span>© {currentYear} Fine Life. All rights reserved.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-primary-accent/10 rounded-lg flex items-center justify-center hover:bg-primary-accent/20 transition-colors"
                aria-label={social.name}
              >
                <social.icon className="text-primary-accent" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
