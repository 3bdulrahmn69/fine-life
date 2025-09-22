'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import AuthGuard from './auth-guard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiCalendar,
  FiArrowLeft,
  FiShield,
  FiCheck,
  FiX,
  FiAtSign,
  FiLogIn,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BiHeart } from 'react-icons/bi';

type AuthMode = 'signin' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
}

interface SigninFormData {
  identifier: string;
  password: string;
}

interface SignupFormData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  agreeToPrivacy: boolean;
}

type FormData = SigninFormData | SignupFormData;

export default function AuthForm({ mode }: AuthFormProps) {
  // Initialize form data based on mode
  const [formData, setFormData] = useState<FormData>(() => {
    if (mode === 'signin') {
      return {
        identifier: '',
        password: '',
      } as SigninFormData;
    } else {
      return {
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        agreeToPrivacy: false,
      } as SignupFormData;
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [lastCheckedUsername, setLastCheckedUsername] = useState('');
  const router = useRouter();

  const isSignup = mode === 'signup';
  const signupData = formData as SignupFormData;
  const signinData = formData as SigninFormData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const previousValue = (formData as unknown as Record<string, unknown>)[
      name
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Reset username availability if username changed (signup only)
    if (isSignup && name === 'username' && value !== previousValue) {
      setUsernameAvailable(null);
      setLastCheckedUsername('');
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name: string, value: string | boolean) => {
    let fieldError = '';

    switch (name) {
      case 'identifier':
        if (!value) {
          fieldError = 'Email or username is required';
        }
        break;

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

      case 'username':
        if (!value) {
          fieldError = 'Username is required';
        } else if (typeof value === 'string' && value.length < 3) {
          fieldError = 'Username must be at least 3 characters';
        } else if (
          typeof value === 'string' &&
          !/^[a-zA-Z0-9_]+$/.test(value)
        ) {
          fieldError =
            'Username can only contain letters, numbers, and underscores';
        } else if (usernameAvailable === false) {
          fieldError =
            'This username is already taken. Please choose another one.';
        } else if (usernameChecking) {
          fieldError = 'Checking username availability...';
        }
        break;

      case 'password':
        if (!value) {
          fieldError = 'Password is required';
        } else if (typeof value === 'string' && value.length < 8 && isSignup) {
          fieldError = 'Password must be at least 8 characters';
        }
        break;

      case 'confirmPassword':
        if (isSignup) {
          if (!value) {
            fieldError = 'Please confirm your password';
          } else if (value !== signupData.password) {
            fieldError = 'Passwords do not match';
          }
        }
        break;

      case 'dateOfBirth':
        if (isSignup) {
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
        }
        break;

      case 'agreeToPrivacy':
        if (isSignup && !value) {
          fieldError = 'You must agree to our privacy policy';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: fieldError }));
    return fieldError;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    validateField(name, fieldValue);

    // Check username availability when user leaves the field (signup only)
    if (
      isSignup &&
      name === 'username' &&
      value &&
      typeof value === 'string' &&
      value.length >= 3
    ) {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;

    if (username === lastCheckedUsername && usernameAvailable !== null) {
      return;
    }

    setUsernameChecking(true);
    setUsernameAvailable(null);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (
        newErrors.username ===
          'This username is already taken. Please choose another one.' ||
        newErrors.username === 'Checking username availability...'
      ) {
        delete newErrors.username;
      }
      return newErrors;
    });

    try {
      const response = await fetch('/api/user/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setUsernameAvailable(data.available);
      setLastCheckedUsername(username);

      if (!data.available) {
        setErrors((prev) => ({
          ...prev,
          username:
            'This username is already taken. Please choose another one.',
        }));
      }
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailable(null);
      setErrors((prev) => ({
        ...prev,
        username: 'Unable to check username availability. Please try again.',
      }));
    } finally {
      setUsernameChecking(false);
    }
  };

  const validateForm = () => {
    const validationErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key,
        (formData as unknown as Record<string, unknown>)[key] as
          | string
          | boolean
      );
      if (error) {
        validationErrors[key] = error;
      }
    });

    // Special check for username availability (signup only)
    if (isSignup && signupData.username && signupData.username.length >= 3) {
      if (usernameChecking) {
        validationErrors.username = 'Checking username availability...';
      } else if (usernameAvailable === false) {
        validationErrors.username =
          'This username is already taken. Please choose another one.';
      } else if (usernameAvailable === null) {
        validationErrors.username =
          'Please wait for username availability check to complete.';
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignup) {
        // Handle signup
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

        toast.success('Registration successful! Redirecting to sign in...');
        setTimeout(() => {
          router.push(
            '/auth/signin?message=Registration successful! Please sign in.'
          );
        }, 1500);
      } else {
        // Handle signin
        const result = await signIn('credentials', {
          identifier: signinData.identifier,
          password: signinData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Invalid credentials. Please try again.');
          setErrors({ general: 'Invalid email/username or password' });
        } else {
          await getSession();
          toast.success('Welcome back! Login successful.');
          router.push('/');
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An error occurred. Please try again.');
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast.info('Redirecting to Google...');
    signIn('google', { callbackUrl: '/' });
  };

  const getTitle = () => {
    return isSignup ? 'Create Your Account' : 'Welcome Back';
  };

  const getDescription = () => {
    return isSignup
      ? 'Join Fine Life and start your journey to a better you'
      : 'Sign in to continue your Fine Life journey';
  };

  const getSubmitText = () => {
    return isSignup ? 'Create Account' : 'Sign In';
  };

  const getLoadingText = () => {
    return isSignup ? 'Creating Account...' : 'Signing In...';
  };

  const getAlternateLink = () => {
    return isSignup ? (
      <p className="text-sm text-primary-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/auth/signin"
          className="text-primary-button hover:text-primary-button-hover underline font-medium transition-colors"
        >
          Sign in here
        </Link>
      </p>
    ) : (
      <p className="text-sm text-primary-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-primary-button hover:text-primary-button-hover underline font-medium transition-colors"
        >
          Create one now
        </Link>
      </p>
    );
  };

  return (
    <AuthGuard requireAuth={false} redirectTo="/">
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
                  {getTitle()}
                </CardTitle>
                <CardDescription className="text-primary-muted-foreground mt-2">
                  {getDescription()}
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
                {/* Signin Fields */}
                {!isSignup && (
                  <>
                    <Input
                      name="identifier"
                      type="text"
                      placeholder="Enter your email or username"
                      value={signinData.identifier}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      error={errors.identifier}
                      disabled={isLoading}
                      leftIcon={<FiMail className="w-4 h-4" />}
                    />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={signinData.password}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      error={errors.password}
                      disabled={isLoading}
                      leftIcon={<FiLock className="w-4 h-4" />}
                      showPasswordToggle={true}
                    />
                  </>
                )}

                {/* Signup Fields */}
                {isSignup && (
                  <>
                    <Input
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.fullName}
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
                      value={signupData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      error={errors.email}
                      disabled={isLoading}
                      leftIcon={<FiMail className="w-4 h-4" />}
                    />

                    <Input
                      name="username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={signupData.username}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      error={errors.username}
                      disabled={isLoading}
                      leftIcon={<FiAtSign className="w-4 h-4" />}
                    />

                    {/* Username availability feedback */}
                    {signupData.username && signupData.username.length >= 3 && (
                      <div className="flex items-center gap-2 mt-1 ml-1">
                        {usernameChecking ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : usernameAvailable === true ? (
                          <FiCheck className="w-4 h-4 text-green-500" />
                        ) : usernameAvailable === false ? (
                          <FiX className="w-4 h-4 text-red-500" />
                        ) : null}

                        {usernameChecking ? (
                          <span className="text-sm text-gray-500">
                            Checking availability...
                          </span>
                        ) : usernameAvailable === true ? (
                          <span className="text-sm text-green-600">
                            Username available
                          </span>
                        ) : usernameAvailable === false ? (
                          <span className="text-sm text-red-600">
                            Username already taken
                          </span>
                        ) : null}
                      </div>
                    )}

                    <Input
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={signupData.password}
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
                      value={signupData.confirmPassword}
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
                      label="Date of Birth"
                      placeholder="Select your date of birth"
                      value={signupData.dateOfBirth}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      error={errors.dateOfBirth}
                      disabled={isLoading}
                      leftIcon={<FiCalendar className="w-4 h-4" />}
                    />

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        name="agreeToPrivacy"
                        checked={signupData.agreeToPrivacy}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
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
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-button to-primary-button-hover hover:from-primary-button-hover hover:to-primary-button text-primary-button-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      {getLoadingText()}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isSignup ? (
                        <FiUserPlus className="w-4 h-4" />
                      ) : (
                        <FiLogIn className="w-4 h-4" />
                      )}
                      {getSubmitText()}
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
                onClick={handleGoogleAuth}
                disabled={isLoading}
                size="lg"
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                {isSignup ? 'Sign up with Google' : 'Continue with Google'}
              </Button>

              <div className="text-center">{getAlternateLink()}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
