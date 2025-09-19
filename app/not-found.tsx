import Link from 'next/link';
import { Button } from './components/ui/button';
import { BiHome, BiError } from 'react-icons/bi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Simple 404 Icon */}
        <div className="mb-8">
          <BiError className="text-6xl text-primary-accent mx-auto mb-4" />
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-primary-foreground mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-primary-text mb-8 max-w-lg mx-auto">
            The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
            you back to managing your finances.
          </p>
        </div>

        {/* Simple Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/">
            <Button size="lg" className="px-6 py-3">
              <BiHome className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
