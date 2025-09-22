import {
  BiHeart,
  BiEnvelope,
  BiPhone,
  BiLogoTwitter,
  BiLogoLinkedin,
  BiLogoGithub,
} from 'react-icons/bi';
import { FiMonitor, FiSun, FiMoon } from 'react-icons/fi';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Security', href: '#security' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
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

  const themeOptions = [
    { value: 'light', icon: FiSun, label: 'Light' },
    { value: 'dark', icon: FiMoon, label: 'Dark' },
    { value: 'system', icon: FiMonitor, label: 'System' },
    { value: 'life', icon: BiHeart, label: 'Life' },
  ];

  return (
    <footer className="bg-primary-card/30 border-t border-primary-border">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary-accent/10 rounded-lg flex items-center justify-center">
                <BiHeart className="text-xl text-primary-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary-foreground">
                  Fine Life
                </h3>
                <p className="text-sm text-primary-muted-foreground">
                  Smart Finance Management
                </p>
              </div>
            </div>
            <p className="text-primary-text text-sm leading-relaxed mb-4">
              Transforming lives through smart financial management.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <BiEnvelope className="text-primary-accent flex-shrink-0" />
                <span>support@finelife.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <BiPhone className="text-primary-accent flex-shrink-0" />
                <span>1-800-FINE-LIFE</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 text-sm">
              Product
            </h4>
            <ul className="space-y-2">
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
            <h4 className="font-semibold text-primary-foreground mb-3 text-sm">
              Company
            </h4>
            <ul className="space-y-2">
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
            <h4 className="font-semibold text-primary-foreground mb-3 text-sm">
              Support
            </h4>
            <ul className="space-y-2">
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
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-primary-border">
          <div className="flex items-center gap-4 text-xs text-primary-text">
            <span>© {currentYear} Fine Life. All rights reserved.</span>
          </div>

          {/* Theme Toggle & Social Links */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <div className="flex items-center gap-1 bg-primary-background/50 rounded-lg p-1 border border-primary-border">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      theme === option.value
                        ? 'bg-primary-accent text-primary-accent-foreground shadow-sm'
                        : 'text-primary-text hover:text-primary-accent hover:bg-primary-accent/10'
                    }`}
                    title={option.label}
                    aria-label={`Switch to ${option.label} theme`}
                  >
                    <option.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary-accent/10 rounded-lg flex items-center justify-center hover:bg-primary-accent/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="text-primary-accent w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
