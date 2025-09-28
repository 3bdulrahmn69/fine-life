import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query based on whether userId is a valid ObjectId or email
    let query;
    if (Types.ObjectId.isValid(userId)) {
      // If it's a valid ObjectId, search by _id or email
      query = { $or: [{ _id: userId }, { email: userId }] };
    } else {
      // If it's not a valid ObjectId, only search by email
      query = { email: userId };
    }

    // Find user by ID or email
    const user = await User.findOne(query).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username || '',
        dateOfBirth: user.dateOfBirth || '',
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
