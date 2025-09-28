'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  FiUser,
  FiSave,
  FiMail,
  FiCalendar,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import SettingsLayout from '../SettingsLayout';

interface PersonalData {
  fullName: string;
  email: string;
  username: string;
  dateOfBirth: string;
}

export default function PersonalInfoPage() {
  const { data: session, update } = useSession();

  // Loading and UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [originalUsername, setOriginalUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Form data states
  const [personalData, setPersonalData] = useState<PersonalData>({
    fullName: '',
    email: '',
    username: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cache states to prevent refresh issues
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [cacheKey, setCacheKey] = useState<string>('');

  // Generate cache key based on user email
  useEffect(() => {
    if (session?.user?.email) {
      setCacheKey(`user_profile_${session.user.email}`);
    }
  }, [session?.user?.email]);

  // Load cached data from localStorage
  useEffect(() => {
    if (cacheKey && !initialDataLoaded && session?.user) {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          const cacheAge = Date.now() - (parsedData.timestamp || 0);

          // Use cache if it's less than 5 minutes old
          if (cacheAge < 5 * 60 * 1000) {
            console.log('✅ Using cached data');
            setPersonalData(parsedData.data);
            setOriginalUsername(parsedData.data.username || '');
            setInitialDataLoaded(true);
            setIsPageLoading(false);
            return;
          } else {
            console.log('🗑️ Cache is stale, removing');
            // Cache is stale, remove it
            localStorage.removeItem(cacheKey);
          }
        } else {
          console.log('❌ No cached data found');
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
        // Remove corrupted cache
        localStorage.removeItem(cacheKey);
      }
    }
  }, [cacheKey, initialDataLoaded, session?.user]); // Load user data when session is available
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user || initialDataLoaded) {
        console.log('🚫 Skipping data load:', {
          hasSession: !!session?.user,
          dataLoaded: initialDataLoaded,
        });
        return;
      }

      console.log('🌐 Loading user profile from API');
      setIsPageLoading(true);

      try {
        const userId = session?.user?.id || session?.user?.email;
        console.log('👤 Using userId:', userId);

        const response = await fetch('/api/user/get-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        const data = await response.json();
        console.log('📡 API Response:', { status: response.status, data });

        if (response.ok && data.user) {
          console.log('✅ Profile loaded successfully');
          setPersonalData(data.user);
          setOriginalUsername(data.user.username || '');
          setInitialDataLoaded(true);

          // Cache the data
          if (cacheKey) {
            try {
              const cacheData = {
                data: data.user,
                timestamp: Date.now(),
              };
              localStorage.setItem(cacheKey, JSON.stringify(cacheData));
              console.log('💾 Data cached successfully');
            } catch (error) {
              console.error('Error caching user data:', error);
            }
          }
        } else {
          console.log('⚠️ API failed, using fallback data');
          // Fallback to session data if API fails
          const fallbackData = {
            fullName: session?.user?.name || '',
            email: session?.user?.email || '',
            username: '',
            dateOfBirth: '',
          };
          setPersonalData(fallbackData);
          setOriginalUsername('');
          setInitialDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to session data
        const fallbackData = {
          fullName: session?.user?.name || '',
          email: session?.user?.email || '',
          username: '',
          dateOfBirth: '',
        };
        setPersonalData(fallbackData);
        setInitialDataLoaded(true);
      } finally {
        setIsPageLoading(false);
      }
    };

    loadUserProfile();
  }, [session, initialDataLoaded, cacheKey]); // Prevent accidental page refresh when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const clearErrors = () => {
    setErrors({});
  };

  // const clearCache = () => {
  //   if (cacheKey) {
  //     try {
  //       localStorage.removeItem(cacheKey);
  //       console.log('Cache cleared for:', cacheKey);
  //     } catch (error) {
  //       console.error('Error clearing cache:', error);
  //     }
  //   }
  // };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;

    setUsernameChecking(true);
    try {
      const response = await fetch('/api/user/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handlePersonalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setPersonalData((prev) => {
      const newData = { ...prev, [name]: value };

      // Check if there are unsaved changes
      const hasChanges = Object.keys(newData).some((key) => {
        if (key === 'dateOfBirth') {
          // Handle date comparison properly
          const originalDate = prev[key] ? prev[key].split('T')[0] : '';
          const newDate = newData[key] ? newData[key].split('T')[0] : '';
          return originalDate !== newDate;
        }
        return (
          newData[key as keyof PersonalData] !== prev[key as keyof PersonalData]
        );
      });

      setHasUnsavedChanges(hasChanges);
      return newData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Check username availability when username changes
    if (name === 'username') {
      if (value.length >= 3 && value !== originalUsername) {
        setTimeout(() => {
          checkUsernameAvailability(value);
        }, 500); // Debounce for 500ms
      } else {
        setUsernameAvailable(null);
        setUsernameChecking(false);
      }
    }
  };

  const validatePersonalForm = () => {
    const newErrors: Record<string, string> = {};

    if (!personalData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!personalData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(personalData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!personalData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (personalData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(personalData.username)) {
      newErrors.username =
        'Username can only contain letters, numbers, and underscores';
    } else if (usernameAvailable === false) {
      newErrors.username =
        'This username is already taken. Please choose another one.';
    } else if (
      usernameAvailable === null &&
      personalData.username.length >= 3 &&
      personalData.username !== originalUsername
    ) {
      newErrors.username = 'Please wait while we check username availability.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePersonalForm()) return;

    setIsLoading(true);
    clearErrors();

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...personalData,
          userId: session?.user?.id || session?.user?.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.fullName,
          email: data.user.email,
        },
      });

      // Update local state with the confirmed data
      setPersonalData(data.user);
      setOriginalUsername(data.user.username || '');
      setHasUnsavedChanges(false); // Reset unsaved changes

      // Update cache with new data
      if (cacheKey) {
        try {
          const cacheData = {
            data: data.user,
            timestamp: Date.now(),
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
          console.error('Error updating cache:', error);
        }
      }

      showMessage(
        'Profile updated successfully! Changes are now visible on your dashboard.',
        'success'
      );
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage(
        error instanceof Error ? error.message : 'Failed to update profile',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout>
      <Card className="bg-primary-card border-primary-border">
        <CardHeader>
          <CardTitle className="flex items-center text-primary-foreground">
            <FiUser className="w-5 h-5 mr-2" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details. Changes will be reflected immediately
            on your dashboard.
            {hasUnsavedChanges && (
              <span className="block text-amber-600 font-medium mt-1">
                ⚠️ You have unsaved changes
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Show loading spinner while initial data is loading */}
          {isPageLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-primary-text">Loading your profile...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-lg border mb-6 ${
                    messageType === 'success'
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p>{message}</p>
                    <button
                      onClick={() => setMessage('')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handlePersonalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="fullName"
                    type="text"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={personalData.fullName}
                    onChange={handlePersonalInputChange}
                    error={errors.fullName}
                    disabled={isLoading}
                    leftIcon={<FiUser className="w-4 h-4" />}
                    required
                  />

                  <div>
                    <Input
                      name="username"
                      type="text"
                      label="Username"
                      placeholder="Choose a unique username"
                      value={personalData.username}
                      onChange={handlePersonalInputChange}
                      error={errors.username}
                      disabled={isLoading}
                      required
                    />
                    {/* Username availability feedback */}
                    {personalData.username &&
                      personalData.username.length >= 3 &&
                      personalData.username !== originalUsername && (
                        <div className="flex items-center gap-2 mt-1">
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={personalData.email}
                    onChange={handlePersonalInputChange}
                    error={errors.email}
                    disabled={isLoading}
                    leftIcon={<FiMail className="w-4 h-4" />}
                    required
                  />

                  <Input
                    name="dateOfBirth"
                    type="date"
                    label="Date of Birth"
                    placeholder="Select your date of birth"
                    value={
                      personalData.dateOfBirth
                        ? personalData.dateOfBirth.split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      setPersonalData((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }));
                      if (errors.dateOfBirth) {
                        setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
                      }
                    }}
                    disabled={isLoading}
                    leftIcon={<FiCalendar className="w-4 h-4" />}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-primary-button to-primary-button-hover"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FiSave className="w-4 h-4" />
                        Save Changes
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </SettingsLayout>
  );
}
