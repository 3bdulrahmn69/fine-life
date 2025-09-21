import crypto from 'crypto';
import User from '../models/User';

/**
 * Generate a cryptographically secure random password
 */
export function generateSecurePassword(length: number = 32): string {
  try {
    if (length < 8 || length > 128) {
      throw new Error('Password length must be between 8 and 128 characters');
    }

    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }

    return password;
  } catch (error) {
    console.error('Error generating secure password:', error);
    // Fallback to a default secure password if crypto fails
    return 'TempSecure123!@#' + Date.now();
  }
}

/**
 * Generate a unique username from email
 */
export async function generateUniqueUsername(email: string): Promise<string> {
  try {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Invalid email provided for username generation');
    }

    // Extract base username from email (part before @)
    const baseUsername = email.split('@')[0].toLowerCase();

    // Clean username: remove special characters, keep only letters and numbers
    const cleanUsername = baseUsername.replace(/[^a-z0-9]/gi, '');

    // Ensure minimum length
    if (cleanUsername.length < 3) {
      const fallbackUsername = `user${crypto.randomBytes(3).toString('hex')}`;
      return await generateUniqueUsername(`${fallbackUsername}@example.com`);
    }

    let username = cleanUsername;
    let counter = 0;

    // Check if username exists and generate alternatives
    while (await isUsernameTaken(username)) {
      counter++;

      if (counter <= 99) {
        // Try with numbers first (user1, user2, etc.)
        username = `${cleanUsername}${counter}`;
      } else {
        // If numbers exhausted, add random characters
        const randomSuffix = crypto.randomBytes(2).toString('hex');
        username = `${cleanUsername}${randomSuffix}`;
      }

      // Prevent infinite loop
      if (counter > 1000) {
        // Fallback to completely random username
        username = `user_${crypto.randomBytes(4).toString('hex')}`;
        break;
      }
    }

    return username;
  } catch (error) {
    console.error('Error generating unique username:', error);
    // Fallback to a random username
    return `user_${crypto.randomBytes(4).toString('hex')}`;
  }
}

/**
 * Check if username is already taken
 */
async function isUsernameTaken(username: string): Promise<boolean> {
  try {
    if (!username || typeof username !== 'string') {
      return true; // Consider invalid usernames as "taken"
    }

    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    return !!existingUser;
  } catch (error) {
    console.error('Error checking username availability:', error);
    // If we can't check, assume it's taken to be safe
    return true;
  }
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  // Username must be 3-20 characters, letters, numbers, underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Generate user data for Google OAuth signup
 */
export async function generateGoogleUserData(user: {
  name?: string | null;
  email: string;
}) {
  try {
    if (!user.email || typeof user.email !== 'string') {
      throw new Error(
        'Valid email is required for Google user data generation'
      );
    }

    const securePassword = generateSecurePassword();
    const username = await generateUniqueUsername(user.email);

    return {
      fullName: user.name || 'Google User',
      email: user.email,
      username: username,
      password: securePassword, // This will be automatically hashed by the User model pre-save hook
      dateOfBirth: new Date('1990-01-01'), // Default date, user can update later
      isGoogleAuth: true, // Flag to identify Google users
      emailVerified: true, // Google emails are pre-verified
    };
  } catch (error) {
    console.error('Error generating Google user data:', error);

    // Fallback data to ensure we can still create a user
    const fallbackUsername = `google_${crypto.randomBytes(4).toString('hex')}`;

    return {
      fullName: user.name || 'Google User',
      email: user.email,
      username: fallbackUsername,
      password: generateSecurePassword(), // This will be automatically hashed by the User model pre-save hook
      dateOfBirth: new Date('1990-01-01'),
      isGoogleAuth: true,
      emailVerified: true,
    };
  }
}
