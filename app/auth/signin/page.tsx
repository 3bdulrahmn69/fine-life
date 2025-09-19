'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { FiMail, FiLock, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BiHeart } from 'react-icons/bi';

export default function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: 'Invalid email or password' });
        toast.error('Invalid email or password');
      } else {
        // Refresh session and redirect
        await getSession();
        toast.success('Welcome back! Login successful.');
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Redirecting to Google...');
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-background via-primary-muted to-primary-accent flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-button/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary-accent/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-primary-button/15 rounded-full blur-lg"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-text hover:text-primary-foreground transition-colors group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </div>

        <Card className="backdrop-blur-sm bg-primary-card/80 border-primary-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-button to-primary-button-hover rounded-2xl flex items-center justify-center">
              <BiHeart className="w-8 h-8 text-primary-button-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-foreground to-primary-text bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-primary-muted-foreground mt-2">
                Sign in to continue your Fine Life journey
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.general && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                disabled={isLoading}
                leftIcon={<FiMail className="w-4 h-4" />}
              />

              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                disabled={isLoading}
                leftIcon={<FiLock className="w-4 h-4" />}
                showPasswordToggle={true}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-button to-primary-button-hover hover:from-primary-button-hover hover:to-primary-button text-primary-button-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FiLogIn className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-primary-card px-4 text-primary-muted-foreground font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-primary-border/60 hover:bg-primary-muted/50 transition-all duration-300"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              size="lg"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-primary-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary-button hover:text-primary-button-hover underline font-medium transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
