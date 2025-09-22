'use client';

import {
  BiHeart,
  BiMenu,
  BiX,
  BiUser,
  BiBarChart,
  BiWallet,
} from 'react-icons/bi';
import { useState } from 'react';
import ThemeToggle from './ui/theme-toggle';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Features', href: '#features', icon: BiBarChart },
    { name: 'How It Works', href: '#how-it-works', icon: BiWallet },
    { name: 'Pricing', href: '#pricing', icon: BiHeart },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary-background/80 backdrop-blur-md border-b border-primary-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center group-hover:bg-primary-accent/20 transition-colors">
              <BiHeart className="text-2xl text-primary-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                Fine Life
              </h1>
              <p className="text-xs text-primary-muted-foreground hidden sm:block">
                Smart Finance Management
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav id="navigation" className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-primary-text hover:text-primary-accent transition-colors font-medium"
              >
                <item.icon className="text-lg" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                <BiUser className="mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-primary-accent/10 transition-colors"
              aria-label={
                isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <BiX className="text-2xl text-primary-foreground" />
              ) : (
                <BiMenu className="text-2xl text-primary-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary-border">
            <nav className="flex flex-col gap-4 pt-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 text-primary-text hover:text-primary-accent transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="text-lg" />
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-primary-border">
                <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <BiUser className="mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
