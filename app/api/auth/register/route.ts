import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, username, password, dateOfBirth } =
      await request.json();

    // Validation
    if (!fullName || !email || !username || !password || !dateOfBirth) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Username validation
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          error: 'Username can only contain letters, numbers, and underscores',
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Age validation
    const birthDate = new Date(dateOfBirth);
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
      return NextResponse.json(
        { error: 'You must be at least 13 years old' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          {
            error:
              'This email address is already registered. Please try signing in instead.',
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error:
              'This username is already taken. Please choose a different username.',
          },
          { status: 400 }
        );
      }
    }

    // Create user (password will be hashed by the model's pre-save middleware)
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      username: username.trim(),
      password: password, // Let the model hash this
      dateOfBirth: birthDate,
    });

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);

    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'ValidationError' &&
      'errors' in error
    ) {
      const validationError = error as unknown as {
        errors: Record<string, { message: string }>;
      };
      const messages = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
