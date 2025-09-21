import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    // Basic validation
    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Username format validation
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

    // Connect to database
    await connectDB();

    // Check if username already exists
    const existingUser = await User.findOne({ username: username.trim() });

    if (existingUser) {
      return NextResponse.json(
        { available: false, message: 'Username is already taken' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: 'Username is available' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
