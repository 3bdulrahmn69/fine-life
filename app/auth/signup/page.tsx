'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiCalendar,
  FiArrowLeft,
  FiShield,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BiHeart } from 'react-icons/bi';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    agreeToPrivacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name: string, value: string | boolean) => {
    let fieldError = '';

    switch (name) {
      case 'fullName':
        if (!value || (typeof value === 'string' && !value.trim())) {
          fieldError = 'Full name is required';
        } else if (typeof value === 'string' && value.trim().length < 2) {
          fieldError = 'Full name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value) {
          fieldError = 'Email is required';
        } else if (typeof value === 'string' && !/\S+@\S+\.\S+/.test(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          fieldError = 'Password is required';
        } else if (typeof value === 'string' && value.length < 8) {
          fieldError = 'Password must be at least 8 characters';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          fieldError = 'Please confirm your password';
        } else if (value !== formData.password) {
          fieldError = 'Passwords do not match';
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          fieldError = 'Date of birth is required';
        } else if (typeof value === 'string') {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          if (age < 13) {
            fieldError = 'You must be at least 13 years old';
          } else if (age > 120) {
            fieldError = 'Please enter a valid date of birth';
          }
        }
        break;

      case 'agreeToPrivacy':
        if (!value) {
          fieldError = 'You must agree to our privacy policy';
        }
        break;
    }

    // Update errors state
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));

    return fieldError;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    validateField(name, fieldValue);
  };

  const validateForm = () => {
    const validationErrors: Record<string, string> = {};

    // Validate all fields and collect errors
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        validationErrors[key] = error;
      }
    });

    // Update errors state with all validation results
    setErrors(validationErrors);

    // Return true if no errors
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
          toast.error('Please fix the errors and try again');
        } else {
          setErrors({
            general: data.error || data.message || 'Something went wrong',
          });
          toast.error(data.error || data.message || 'Something went wrong');
        }
        return;
      }

      // Success - redirect to signin
      toast.success('Registration successful! Redirecting to sign in...');
      setTimeout(() => {
        router.push(
          '/auth/signin?message=Registration successful! Please sign in.'
        );
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    toast.info('Redirecting to Google...');
    // TODO: Implement Google OAuth sign up
    console.log('Google sign up clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-background via-primary-muted to-primary-accent flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary-button/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-primary-accent/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-primary-button/15 rounded-full blur-lg"></div>
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
                Create Your Account
              </CardTitle>
              <CardDescription className="text-primary-muted-foreground mt-2">
                Join Fine Life and start your journey to a better you
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
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.fullName}
                disabled={isLoading}
                leftIcon={<FiUser className="w-4 h-4" />}
              />

              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.email}
                disabled={isLoading}
                leftIcon={<FiMail className="w-4 h-4" />}
              />

              <Input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.password}
                disabled={isLoading}
                leftIcon={<FiLock className="w-4 h-4" />}
                showPasswordToggle={true}
              />

              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.confirmPassword}
                disabled={isLoading}
                leftIcon={<FiLock className="w-4 h-4" />}
                showPasswordToggle={true}
              />

              <Input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.dateOfBirth}
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
                leftIcon={<FiCalendar className="w-4 h-4" />}
              />

              <div className="flex items-start space-x-3">
                <Checkbox
                  name="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onChange={handleInputChange}
                  onBlur={() =>
                    validateField('agreeToPrivacy', formData.agreeToPrivacy)
                  }
                  disabled={isLoading}
                  className="mt-1"
                />
                <div className="text-sm leading-relaxed">
                  <label
                    htmlFor="agreeToPrivacy"
                    className="text-primary-text cursor-pointer"
                  >
                    <FiShield className="inline w-4 h-4 mr-1 text-primary-muted-foreground" />
                    I agree to the{' '}
                    <Link
                      href="/privacy"
                      className="text-primary-button hover:text-primary-button-hover underline font-medium"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/terms"
                      className="text-primary-button hover:text-primary-button-hover underline font-medium"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>
                  </label>
                  {errors.agreeToPrivacy && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.agreeToPrivacy}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-button to-primary-button-hover hover:from-primary-button-hover hover:to-primary-button text-primary-button-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Create Account
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
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              size="lg"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Sign up with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-primary-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="text-primary-button hover:text-primary-button-hover underline font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
