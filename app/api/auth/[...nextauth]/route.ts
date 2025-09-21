import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import {
  generateGoogleUserData,
  generateUniqueUsername,
} from '../../../lib/auth-utils';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();

          // Check if identifier is email or username
          const isEmail = /\S+@\S+\.\S+/.test(credentials.identifier);

          const user = await User.findOne(
            isEmail
              ? { email: credentials.identifier }
              : { username: credentials.identifier }
          ).select('+password');

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullName,
          };
        } catch (error) {
          console.error('Credentials authentication error:', error);
          // More specific error logging for debugging
          if (error instanceof Error) {
            console.error('Error details:', {
              message: error.message,
              stack: error.stack,
              identifier: credentials.identifier,
            });
          }
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // For Google OAuth users, we need to find their database ID
        if (user.email && !token.dbId) {
          try {
            await connectDB();
            const dbUser = await User.findOne({ email: user.email });
            if (dbUser) {
              token.dbId = dbUser._id.toString();
              token.id = dbUser._id.toString(); // Use database ID, not Google ID
              token.name = dbUser.fullName;
              token.email = dbUser.email;
            } else {
              // Fallback to provided user data if DB user not found
              token.id = user.id;
              token.name = user.name;
              token.email = user.email;
            }
          } catch (error) {
            console.error('Error finding user in JWT callback:', error);
            // Fallback to provided user data
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
          }
        } else {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
        }
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser && user.email) {
            // Generate secure user data for Google sign-in
            const userData = await generateGoogleUserData({
              name: user.name,
              email: user.email,
            });

            // Create a new user for Google sign-in
            const newUser = await User.create(userData);

            console.log(
              `New Google user created successfully: ${user.email} with username: ${userData.username}`
            );

            // Verify the user was actually created
            if (!newUser) {
              console.error('Failed to create new Google user in database');
              return false;
            }
          } else if (existingUser && !existingUser.username && user.email) {
            // If user exists but doesn't have username, generate one
            const username = await generateUniqueUsername(user.email);
            existingUser.username = username;
            await existingUser.save();
            console.log(`Username generated for existing user: ${username}`);
          } else if (existingUser && user.email) {
            // Check if the existing user has an unhashed password and fix it
            const isPasswordHashed =
              existingUser.password.startsWith('$2b$') ||
              existingUser.password.startsWith('$2a$');

            if (!isPasswordHashed) {
              console.log(`Fixing unhashed password for user: ${user.email}`);
              // The save() will trigger the pre-save hook to hash the password
              await existingUser.save();
            }
          }

          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);

          // Enhanced error logging
          if (error instanceof Error) {
            console.error('Google OAuth error details:', {
              message: error.message,
              stack: error.stack,
              userEmail: user.email,
              provider: account?.provider,
            });
          }

          // Log to external service if available (you could add services like Sentry here)
          // logErrorToService('google-oauth-error', error, { userEmail: user.email });

          return false;
        }
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
