'use client';

import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { BiHeart } from 'react-icons/bi';
import Link from 'next/link';
import AuthGuard from '../../auth/auth-guard';
import Footer from '../../components/footer';
import Container from '../../components/ui/container';

interface DashboardProps {
  children: React.ReactNode;
}

const navLinks = [
  { name: 'Overview', href: '/' },
  { name: 'Transactions', href: '/transactions' },
  { name: 'Budget', href: '/budget' },
  { name: 'Statistics', href: '/statistics' },
];

export default function Dashboard({ children }: DashboardProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Get current tab from pathname
  const getCurrentTab = () => {
    if (pathname === '/transactions') return 'transactions';
    if (pathname === '/budget') return 'budget';
    if (pathname === '/statistics') return 'statistics';
    return 'overview';
  };

  const activeTab = getCurrentTab();

  return (
    <AuthGuard requireAuth={true} redirectTo="/auth/signin">
      <div className="min-h-screen bg-primary-background flex flex-col">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-primary-card border-r border-primary-border shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-primary-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-button to-primary-button-hover rounded-lg flex items-center justify-center">
                <BiHeart className="w-5 h-5 text-primary-button-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">
                Fine Life
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-primary-muted transition-colors"
            >
              <FiX className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          <nav className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === link.name.toLowerCase()
                      ? 'bg-primary-muted text-primary-foreground'
                      : 'text-primary-muted-foreground hover:text-primary-foreground hover:bg-primary-muted/50'
                  }`}
                >
                  {link.name}
                </button>
              </Link>
            ))}

            {/* User Section */}
            <div className="border-t border-primary-border pt-4 mt-4">
              <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors text-primary-muted-foreground hover:text-primary-foreground hover:bg-primary-muted/50 flex items-center space-x-3">
                  <FiSettings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors text-red-500 hover:text-red-600 hover:bg-red-500/10 flex items-center space-x-3"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Header */}
        <header className="bg-primary-card border-b border-primary-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-button to-primary-button-hover rounded-lg flex items-center justify-center">
                    <BiHeart className="w-5 h-5 text-primary-button-foreground" />
                  </div>
                  <span className="text-xl font-bold text-primary-foreground">
                    Fine Life
                  </span>
                </div>

                <nav className="hidden md:flex space-x-6">
                  {navLinks.map((link) => (
                    <Link key={link.name} href={link.href}>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === link.name.toLowerCase()
                            ? 'bg-primary-muted text-primary-foreground'
                            : 'text-primary-muted-foreground hover:text-primary-foreground'
                        }`}
                      >
                        {link.name}
                      </button>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Menu Button & User Menu */}
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-primary-muted transition-colors"
                  aria-label="Open menu"
                >
                  <FiMenu className="w-5 h-5 text-primary-foreground" />
                </button>

                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/settings" className="flex items-center">
                    <Button variant="ghost" size="sm">
                      <FiSettings className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <FiLogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <Container size="xl" padding="sm" className="flex-1">
          {children}
        </Container>

        {/* Footer */}
        <Footer simple={true} />
      </div>
    </AuthGuard>
  );
}
